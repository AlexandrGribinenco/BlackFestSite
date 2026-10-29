// POST /api/payments/callback — maib sends the payment result here (server to server), signed in the X-Signature and
// X-Signature-Timestamp headers. The body is read as raw text: the signature covers its exact bytes.
// maib's retry policy for the callback is not documented; answering 200 to every valid callback is the safe side.
import { paymentConfirmationEmail, sendEmail } from "@/server/email";
import { getCheckout, verifyCallbackSignature, type CheckoutCallback } from "@/server/maib";
import { paidOrder } from "@/server/orders";
import { ticketsAttachment } from "@/server/tickets";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyCallbackSignature(raw, request.headers.get("x-signature"), request.headers.get("x-signature-timestamp"))) {
    console.warn("[payments] callback with a bad signature");
    return new Response("Bad signature", { status: 401 });
  }

  const callback = JSON.parse(raw) as CheckoutCallback;
  console.info(`[payments] callback ${callback.orderId} checkout ${callback.checkoutId} payment ${callback.paymentId}: ${callback.paymentStatus}`);

  if (callback.paymentStatus === "Executed") {
    try {
      // The checkout details hold the items and the buyer, so the e-mail and the e-tickets need no database
      const order = paidOrder(await getCheckout(callback.checkoutId), callback);
      // Without the PDF the e-mail still goes out and says the tickets follow
      const tickets = await ticketsAttachment(order).catch((error) => {
        console.error(`[payments] e-tickets for ${order.orderId} failed`, error);
        return null;
      });
      const email = paymentConfirmationEmail(order, tickets ?? undefined);
      if (email) await sendEmail(email);
    } catch (error) {
      // Still answer 200: a retry would not help and could send the e-mail twice
      console.error(`[payments] confirmation e-mail for ${callback.orderId} failed`, error);
    }
    // TODO: mark the order as paid and release the seat hold (needs the database)
  }

  return new Response("OK", { status: 200 });
}
