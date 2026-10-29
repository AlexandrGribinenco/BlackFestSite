// GET /api/payments/:checkoutId — payment result for the page the buyer returns to from maib (successUrl / failUrl
// carry checkoutId). The redirect itself isn't signed, so the status always comes from maib here.
// Answers with the order details only, without the buyer's contacts.
import { json, preflight } from "@/server/http";
import { MaibError, getCheckout, isMaibConfigured, type Checkout } from "@/server/maib";
import { paidOrder } from "@/server/orders";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f-]{36}$/i;

// The buyer sees three outcomes: paid, still in progress, or not paid
function outcome(checkout: Checkout): "OK" | "PENDING" | "FAILED" {
  const paid = checkout.payment?.status;
  if (paid === "Executed" || paid === "PartiallyRefunded" || paid === "Refunded") return "OK";
  if (paid === "Failed" || ["Expired", "Abandoned", "Cancelled", "Failed"].includes(checkout.status)) return "FAILED";
  return "PENDING";
}

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function GET(request: Request, { params }: { params: Promise<{ checkoutId: string }> }) {
  if (!isMaibConfigured()) return json(request, { error: "Online payment is not connected yet" }, 503);

  const { checkoutId } = await params;
  if (!UUID.test(checkoutId)) return json(request, { error: "Unknown payment" }, 404);

  try {
    const checkout = await getCheckout(checkoutId);
    const order = paidOrder(checkout);
    const status = outcome(checkout);
    return json(request, {
      checkoutId,
      orderId: order.orderId,
      status,
      amount: order.amount,
      currency: order.currency,
      items: order.items,
      paidAt: status === "OK" ? order.paidAt.toISOString() : null,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`[payments] checkout ${checkoutId} failed`, error);
    return json(request, { error: error instanceof MaibError ? "Unknown payment" : "Something went wrong" }, 502);
  }
}
