// GET /api/payments/:payId — payment result for the page the buyer returns to from maib (okUrl / failUrl).
// Answers with order details only, without the buyer's contacts.
import { json, preflight } from "@/server/http";
import { MaibError, getPaymentInfo, isMaibConfigured } from "@/server/maib";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f-]{36}$/i;

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function GET(request: Request, { params }: { params: Promise<{ payId: string }> }) {
  if (!isMaibConfigured()) return json(request, { error: "Online payment is not connected yet" }, 503);

  const { payId } = await params;
  if (!UUID.test(payId)) return json(request, { error: "Unknown payment" }, 404);

  try {
    const payment = await getPaymentInfo(payId);
    return json(request, {
      payId: payment.payId,
      orderId: payment.orderId,
      status: payment.status,
      statusMessage: payment.statusMessage,
      amount: payment.amount,
      currency: payment.currency,
      items: payment.items ?? [],
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`[payments] pay-info ${payId} failed`, error);
    return json(request, { error: error instanceof MaibError ? "Unknown payment" : "Something went wrong" }, 502);
  }
}
