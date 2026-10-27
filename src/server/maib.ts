// maib e-commerce API client (direct payment). Server only: it holds the project secret and the signature key.
// Docs: https://docs.maibmerchants.md/e-commerce — access token, /pay, /pay-info, /refund, callback signature.
import { createHash, timingSafeEqual } from "node:crypto";

const API_URL = process.env.MAIB_API_URL ?? "https://api.maibmerchants.md/v1";

type MaibErrorItem = { errorCode: string; errorMessage: string; errorArgs?: Record<string, unknown> };

export class MaibError extends Error {
  constructor(
    message: string,
    readonly errors: MaibErrorItem[] = [],
  ) {
    super(message);
    this.name = "MaibError";
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new MaibError(`${name} is not set`);
  return value;
}

/** True when the maib project credentials are configured */
export function isMaibConfigured(): boolean {
  return Boolean(process.env.MAIB_PROJECT_ID && process.env.MAIB_PROJECT_SECRET && process.env.MAIB_SIGNATURE_KEY);
}

async function call<T>(path: string, init: { method: "GET" | "POST"; body?: unknown; token?: string }): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: init.method,
    headers: {
      ...(init.body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(init.token ? { Authorization: `Bearer ${init.token}` } : {}),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as { ok?: boolean; result?: T; errors?: MaibErrorItem[] } | null;
  if (!data?.ok || data.result === undefined) {
    const errors = data?.errors ?? [];
    throw new MaibError(errors.map((e) => `${e.errorCode}: ${e.errorMessage}`).join("; ") || `maib ${path}: HTTP ${response.status}`, errors);
  }
  return data.result;
}

/** Whether this server reaches the maib API at all (for /api/health): any HTTP answer counts, no credentials are sent */
export async function pingMaib(): Promise<number> {
  const response = await fetch(`${API_URL}/generate-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  return response.status;
}

// ---------- Access token ----------

type TokenResult = { accessToken: string; expiresIn: number; refreshToken: string; refreshExpiresIn: number };

// Kept per server instance; renewed a little before it expires
let token: { access: string; accessUntil: number; refresh: string; refreshUntil: number } | null = null;
const SAFETY_MS = 30_000;

async function accessToken(): Promise<string> {
  const now = Date.now();
  if (token && token.accessUntil - SAFETY_MS > now) return token.access;

  let result: TokenResult | null = null;
  if (token && token.refreshUntil - SAFETY_MS > now) {
    result = await call<TokenResult>("/generate-token", { method: "POST", body: { refreshToken: token.refresh } }).catch(() => null);
  }
  result ??= await call<TokenResult>("/generate-token", {
    method: "POST",
    body: { projectId: requireEnv("MAIB_PROJECT_ID"), projectSecret: requireEnv("MAIB_PROJECT_SECRET") },
  });

  token = {
    access: result.accessToken,
    accessUntil: now + result.expiresIn * 1000,
    refresh: result.refreshToken,
    refreshUntil: now + result.refreshExpiresIn * 1000,
  };
  return token.access;
}

// ---------- Payments ----------

export type MaibItem = { id: string; name: string; price: number; quantity: number };

export type PaymentRequest = {
  /** Format X.XX, at least 1 */
  amount: number;
  currency: "MDL" | "EUR" | "USD";
  clientIp: string;
  /** Language of the maib payment page */
  language: "ro" | "en" | "ru";
  description: string;
  clientName?: string;
  email?: string;
  phone?: string;
  /** Up to 36 characters */
  orderId: string;
  delivery?: number;
  items: MaibItem[];
  callbackUrl: string;
  okUrl: string;
  failUrl: string;
};

/** Registers a direct payment; the buyer pays on payUrl and comes back to okUrl / failUrl with payId and orderId */
export async function createPayment(request: PaymentRequest) {
  return call<{ payId: string; orderId: string; payUrl: string }>("/pay", { method: "POST", body: request, token: await accessToken() });
}

/** OK, FAILED, CREATED, PENDING, DECLINED or TIMEOUT */
export type PaymentStatus = "OK" | "FAILED" | "CREATED" | "PENDING" | "DECLINED" | "TIMEOUT";

export type PaymentInfo = {
  payId: string;
  orderId?: string;
  status: PaymentStatus;
  statusCode?: string;
  statusMessage?: string;
  threeDs?: string;
  rrn?: string;
  approval?: string;
  cardNumber?: string;
  amount: number;
  confirmAmount?: number;
  refundAmount?: number;
  currency: string;
  description?: string;
  clientName?: string;
  email?: string;
  phone?: string;
  delivery?: number;
  items?: MaibItem[];
};

export async function getPaymentInfo(payId: string) {
  return call<PaymentInfo>(`/pay-info/${encodeURIComponent(payId)}`, { method: "GET", token: await accessToken() });
}

/** Full refund when refundAmount is omitted; a payment can be refunded only once */
export async function refundPayment(payId: string, refundAmount?: number) {
  return call<{ payId: string; orderId?: string; status: string; statusCode?: string; statusMessage?: string; refundAmount: number }>("/refund", {
    method: "POST",
    body: refundAmount === undefined ? { payId } : { payId, refundAmount },
    token: await accessToken(),
  });
}

// ---------- Callback ----------

export type CallbackPayload = {
  result: Record<string, string | number | boolean | null | undefined>;
  signature: string;
};

/**
 * Checks the signature maib sends with the final payment result:
 * Base64(SHA-256(values of `result` sorted by key, then the Signature Key, joined with ":")).
 * The hash must be the raw bytes, not hex.
 */
export function verifyCallbackSignature(payload: CallbackPayload, signatureKey = requireEnv("MAIB_SIGNATURE_KEY")): boolean {
  if (!payload?.result || typeof payload.signature !== "string") return false;

  const values = Object.keys(payload.result)
    .sort()
    .map((key) => {
      const value = payload.result[key];
      return value === null || value === undefined ? "" : String(value);
    });
  const expected = createHash("sha256").update([...values, signatureKey].join(":"), "utf8").digest();
  const received = Buffer.from(payload.signature, "base64");

  return received.length === expected.length && timingSafeEqual(received, expected);
}
