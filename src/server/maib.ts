// maib e-Commerce Checkout API client (hosted checkout page). Server only: it holds the client secret and the
// signature key. Docs: https://docs.maibmerchants.md/checkout — access token, /v2/checkouts, /v2/payments, refunds,
// callback signature. Sandbox and production differ only by the address and the credentials.
import { createHmac, timingSafeEqual } from "node:crypto";

const API_URL = (process.env.MAIB_API_URL ?? "https://api.maibmerchants.md").replace(/\/$/, "");

type MaibErrorItem = { errorCode: string; errorMessage: string; errorArgs?: Record<string, unknown> };

export class MaibError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly errors: MaibErrorItem[] = [],
  ) {
    super(message);
    this.name = "MaibError";
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new MaibError(`${name} is not set`, 0);
  return value;
}

/** True when the maib credentials are configured */
export function isMaibConfigured(): boolean {
  return Boolean(process.env.MAIB_CLIENT_ID && process.env.MAIB_CLIENT_SECRET && process.env.MAIB_SIGNATURE_KEY);
}

/** Whether this server reaches the maib API at all (for /api/health): any HTTP answer counts, no credentials are sent */
export async function pingMaib(): Promise<number> {
  const response = await fetch(`${API_URL}/v2/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  return response.status;
}

// ---------- Requests ----------

type Envelope<T> = { ok?: boolean; result?: T; errors?: MaibErrorItem[] | null };

async function request<T>(path: string, init: { method: "GET" | "POST"; body?: unknown; token?: string }): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: init.method,
    headers: {
      Accept: "application/json",
      ...(init.body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(init.token ? { Authorization: `Bearer ${init.token}` } : {}),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });

  // 401 comes without a body; some errors come as a bare array instead of { ok, errors }
  const data = (await response.json().catch(() => null)) as Envelope<T> | MaibErrorItem[] | null;
  const errors = Array.isArray(data) ? data : (data?.errors ?? []);
  if (!response.ok || Array.isArray(data) || !data?.ok || data.result === undefined) {
    const message = errors.map((e) => `${e.errorCode}: ${e.errorMessage}`).join("; ") || `maib ${init.method} ${path}: HTTP ${response.status}`;
    throw new MaibError(message, response.status, errors);
  }
  return data.result;
}

// ---------- Access token ----------

// Lives about 5 minutes and has no refresh token: a new one is asked for a little before it expires, and after a 401
let token: { value: string; until: number } | null = null;
const SAFETY_MS = 30_000;

async function accessToken(fresh = false): Promise<string> {
  if (!fresh && token && token.until - SAFETY_MS > Date.now()) return token.value;
  const result = await request<{ accessToken: string; expiresIn: number }>("/v2/auth/token", {
    method: "POST",
    body: { clientId: requireEnv("MAIB_CLIENT_ID"), clientSecret: requireEnv("MAIB_CLIENT_SECRET") },
  });
  token = { value: result.accessToken, until: Date.now() + result.expiresIn * 1000 };
  return token.value;
}

/** An authorized call; a rejected token is renewed once */
async function authorized<T>(path: string, init: { method: "GET" | "POST"; body?: unknown }): Promise<T> {
  try {
    return await request<T>(path, { ...init, token: await accessToken() });
  } catch (error) {
    if (!(error instanceof MaibError) || error.status !== 401) throw error;
    return request<T>(path, { ...init, token: await accessToken(true) });
  }
}

// ---------- Checkout ----------

export type CheckoutItem = {
  /** Our id of the item (SKU); comes back in the order */
  externalId: string;
  /** Up to 125 characters */
  title: string;
  /** Unit price, major units */
  amount: number;
  currency: string;
  quantity: number;
};

export type CheckoutRequest = {
  /** Major units, above 0 */
  amount: number;
  currency: "MDL" | "EUR" | "USD";
  orderInfo: {
    id: string;
    /** Up to 125 characters */
    description: string;
    /** ISO 8601 */
    date: string;
    /** Items without delivery */
    orderAmount: number;
    orderCurrency: string;
    deliveryAmount?: number;
    deliveryCurrency?: string;
    items: CheckoutItem[];
  };
  payerInfo: { name?: string; email?: string; phone?: string; ip?: string; userAgent?: string };
  /** Language of the maib checkout page */
  language: "ro" | "ru" | "en";
  callbackUrl: string;
  successUrl: string;
  failUrl: string;
};

/** Registers a hosted checkout; the buyer pays on checkoutUrl and comes back to successUrl / failUrl */
export function createCheckout(checkout: CheckoutRequest) {
  return authorized<{ checkoutId: string; checkoutUrl: string }>("/v2/checkouts", { method: "POST", body: checkout });
}

export type CheckoutStatus = "WaitingForInit" | "Initialized" | "PaymentMethodSelected" | "Completed" | "Expired" | "Abandoned" | "Cancelled" | "Failed";
export type PaymentStatus = "Executed" | "PartiallyRefunded" | "Refunded" | "Failed";

export type Checkout = {
  id: string;
  createdAt: string;
  status: CheckoutStatus;
  amount: number;
  currency: string;
  completedAt?: string | null;
  order?: {
    id?: string | null;
    description?: string | null;
    amount?: number | null;
    deliveryAmount?: number | null;
    orderItems?: Array<{ externalId?: string | null; title?: string | null; amount?: number | null; quantity?: number | null }> | null;
  } | null;
  payer?: { name?: string | null; email?: string | null; phone?: string | null } | null;
  payment?: {
    paymentId: string;
    executedAt: string;
    status: PaymentStatus;
    amount: number;
    currency: string;
    refundedAmount: number;
    paymentMethod?: string | null;
  } | null;
};

export function getCheckout(checkoutId: string) {
  return authorized<Checkout>(`/v2/checkouts/${encodeURIComponent(checkoutId)}`, { method: "GET" });
}

// ---------- Refunds ----------

/** Full refund when amount is the whole payment, partial otherwise. The result is known later: see getRefund() */
export function refundPayment(paymentId: string, amount: number, reason: string) {
  return authorized<{ refundId: string; status: string }>(`/v2/payments/${encodeURIComponent(paymentId)}/refund`, {
    method: "POST",
    body: { amount, reason: reason.slice(0, 500) },
  });
}

/** Created → Requested → Accepted, or Rejected / Manual */
export function getRefund(refundId: string) {
  return authorized<{ id: string; paymentId: string; refundType: string; amount: number; currency: string; status: string; executedAt?: string }>(
    `/v2/payments/refunds/${encodeURIComponent(refundId)}`,
    { method: "GET" },
  );
}

// ---------- Callback ----------

/** What maib posts to callbackUrl after a payment (flat JSON) */
export type CheckoutCallback = {
  checkoutId: string;
  amount: number;
  currency: string;
  completedAt?: string;
  payerName?: string | null;
  payerEmail?: string | null;
  orderId?: string | null;
  paymentId: string;
  paymentAmount: number;
  paymentCurrency: string;
  paymentStatus: string;
  paymentExecutedAt?: string;
  /** Masked, e.g. 444433******1111 */
  senderCardNumber?: string | null;
  paymentMethod?: string | null;
};

const MAX_CLOCK_SKEW_MS = 10 * 60 * 1000;

/**
 * Checks the callback signature: X-Signature is "sha256=" + Base64(HMAC-SHA256(Signature Key, raw body + "." +
 * X-Signature-Timestamp)). The raw body must be the exact text received — parsing and re-serializing it changes the
 * bytes. Old timestamps are refused, so a recorded callback can't be replayed.
 */
export function verifyCallbackSignature(
  rawBody: string,
  signatureHeader: string | null,
  timestampHeader: string | null,
  signatureKey = requireEnv("MAIB_SIGNATURE_KEY"),
): boolean {
  if (!signatureHeader?.startsWith("sha256=") || !timestampHeader) return false;
  const timestamp = Number(timestampHeader);
  if (!Number.isFinite(timestamp) || Math.abs(Date.now() - timestamp) > MAX_CLOCK_SKEW_MS) return false;

  const expected = Buffer.from(createHmac("sha256", signatureKey).update(`${rawBody}.${timestampHeader}`, "utf8").digest("base64"));
  const received = Buffer.from(signatureHeader.slice("sha256=".length).trim());
  return received.length === expected.length && timingSafeEqual(received, expected);
}
