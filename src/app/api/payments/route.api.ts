// POST /api/payments — creates a maib payment for the checkout order and returns the maib payment page URL.
// Route files here are named route.api.ts: server builds pick them up, the static GitHub Pages export skips them
// (see pageExtensions in next.config.ts).
import { clientIp, json, preflight, urls } from "@/server/http";
import { MaibError, createPayment, isMaibConfigured } from "@/server/maib";
import { newOrderId, priceOrder } from "@/server/orders";
import { CURRENCY } from "@/lib/checkout";
import { COMPANY } from "@/lib/company";

export const dynamic = "force-dynamic";

type Body = {
  order?: unknown;
  customer?: { firstName?: string; lastName?: string; email?: string; phone?: string };
  acceptTerms?: boolean;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function POST(request: Request) {
  if (!isMaibConfigured()) return json(request, { error: "Online payment is not connected yet" }, 503);

  const body = (await request.json().catch(() => null)) as Body | null;
  if (!body) return json(request, { error: "Invalid request" }, 400);

  // maib requires the buyer to accept the Terms & Conditions before paying
  if (body.acceptTerms !== true) return json(request, { error: "Accept the Terms & Conditions to continue" }, 400);

  const email = body.customer?.email?.trim() ?? "";
  if (!EMAIL.test(email)) return json(request, { error: "Enter a valid e-mail" }, 400);

  const priced = priceOrder(body.order);
  if ("error" in priced) return json(request, { error: priced.error }, 400);

  const { site, api } = urls();
  const orderId = newOrderId();
  const name = [body.customer?.firstName, body.customer?.lastName].filter(Boolean).join(" ").trim();

  try {
    const payment = await createPayment({
      amount: priced.total,
      currency: CURRENCY,
      clientIp: clientIp(request),
      language: "en",
      description: `${COMPANY.siteName} 2027 — order ${orderId}`,
      clientName: name.slice(0, 128) || undefined,
      email: email.slice(0, 40),
      phone: body.customer?.phone?.trim().slice(0, 40) || undefined,
      orderId,
      items: priced.items,
      callbackUrl: `${api}/api/payments/callback`,
      okUrl: `${site}/checkout/result`,
      failUrl: `${site}/checkout/result`,
    });
    // TODO: save the order (items, buyer, seats, payId) once there is a database; see docs/payments-maib.md
    return json(request, { payUrl: payment.payUrl, payId: payment.payId, orderId });
  } catch (error) {
    console.error("[payments] create failed", error);
    const message = error instanceof MaibError ? "The payment service is not available right now. Please try again later." : "Something went wrong";
    return json(request, { error: message }, 502);
  }
}
