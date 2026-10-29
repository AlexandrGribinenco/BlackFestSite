// POST /api/admin/refund { checkoutId, amount?, reason? } — refunds a paid checkout: the maib integration test asks for
// one, and the organizer needs it until there is an admin page. Without an amount the rest of the payment is refunded.
// GET /api/admin/refund?refundId=… — the refund's status (maib processes it in the background).
// Locked by ADMIN_TOKEN (Authorization: Bearer …); without the setting the route answers 404 like any unknown page.
import { timingSafeEqual } from "node:crypto";
import { MaibError, getCheckout, getRefund, refundPayment } from "@/server/maib";

export const dynamic = "force-dynamic";

function allowed(request: Request): boolean {
  const expected = process.env.ADMIN_TOKEN ?? "";
  if (expected.length < 24) return false;
  const given = Buffer.from(request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "");
  return given.length === expected.length && timingSafeEqual(given, Buffer.from(expected));
}

const notFound = () => Response.json({ error: "Not found" }, { status: 404 });

function failure(error: unknown) {
  console.error("[refund] failed", error);
  return Response.json({ error: error instanceof MaibError ? error.message : "Something went wrong" }, { status: 502 });
}

export async function POST(request: Request) {
  if (!allowed(request)) return notFound();

  const body = (await request.json().catch(() => null)) as { checkoutId?: string; amount?: number; reason?: string } | null;
  if (!body?.checkoutId) return Response.json({ error: "checkoutId is required" }, { status: 400 });

  try {
    const { payment } = await getCheckout(body.checkoutId);
    if (!payment || payment.status === "Failed") return Response.json({ error: "This checkout has no successful payment" }, { status: 409 });

    const left = Math.round((payment.amount - payment.refundedAmount) * 100) / 100;
    const amount = body.amount ?? left;
    if (!(amount > 0 && amount <= left)) return Response.json({ error: `The refund must be above 0 and at most ${left} ${payment.currency}` }, { status: 400 });

    const refund = await refundPayment(payment.paymentId, amount, body.reason?.trim() || "Refund requested by the organizer");
    console.info(`[refund] ${refund.refundId} for payment ${payment.paymentId}: ${amount} ${payment.currency}, ${refund.status}`);
    return Response.json({ ...refund, paymentId: payment.paymentId, amount, currency: payment.currency });
  } catch (error) {
    return failure(error);
  }
}

export async function GET(request: Request) {
  if (!allowed(request)) return notFound();

  const refundId = new URL(request.url).searchParams.get("refundId");
  if (!refundId) return Response.json({ error: "refundId is required" }, { status: 400 });

  try {
    return Response.json(await getRefund(refundId));
  } catch (error) {
    return failure(error);
  }
}
