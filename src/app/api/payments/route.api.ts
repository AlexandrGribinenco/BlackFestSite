// POST /api/payments — registers a maib checkout for the ticket order and returns the maib checkout page URL.
// Route files here are named route.api.ts: server builds pick them up, the static GitHub Pages export skips them
// (see pageExtensions in next.config.ts).
import { clientIp, json, preflight, urls } from "@/server/http";
import { MaibError, createCheckout, isMaibConfigured } from "@/server/maib";
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

/** maib wants the phone as E.164 (+37360000000); anything else is left out rather than failing the payment */
function e164(phone: string | undefined): string | undefined {
  const compact = phone?.replace(/[\s()-]/g, "") ?? "";
  return /^\+\d{8,15}$/.test(compact) ? compact : undefined;
}

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
    const checkout = await createCheckout({
      amount: priced.total,
      currency: CURRENCY,
      orderInfo: {
        id: orderId,
        description: `${COMPANY.siteName} 2027 — order ${orderId}`.slice(0, 125),
        date: new Date().toISOString(),
        orderAmount: priced.total,
        orderCurrency: CURRENCY,
        items: priced.items.map((item) => ({
          externalId: item.id,
          title: item.name.slice(0, 125),
          amount: item.price,
          currency: CURRENCY,
          quantity: item.quantity,
        })),
      },
      payerInfo: {
        name: name.slice(0, 128) || undefined,
        email,
        phone: e164(body.customer?.phone),
        ip: clientIp(request),
        userAgent: request.headers.get("user-agent")?.slice(0, 500) ?? undefined,
      },
      language: "en",
      callbackUrl: `${api}/api/payments/callback`,
      // maib adds ?checkoutId=…&checkoutStatus=…&orderId=…
      successUrl: `${site}/checkout/result`,
      failUrl: `${site}/checkout/result`,
    });
    // TODO: save the order (items, buyer, seats, checkoutId) once there is a database; see docs/payments-maib.md
    return json(request, { payUrl: checkout.checkoutUrl, checkoutId: checkout.checkoutId, orderId });
  } catch (error) {
    console.error("[payments] checkout failed", error);
    const message = error instanceof MaibError ? "The payment service is not available right now. Please try again later." : "Something went wrong";
    return json(request, { error: message }, 502);
  }
}
