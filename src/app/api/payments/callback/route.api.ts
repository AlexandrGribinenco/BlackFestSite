// POST /api/payments/callback — maib sends the final payment result here (server to server).
// maib retries until it gets HTTP 200 (after 10 s, 1 min, 5 min, 10 min, 1 h, 12 h and 24 h).
// The firewall must let in maib's servers: 91.250.245.70, 91.250.245.71, 91.250.245.142.
import { paymentConfirmationEmail, sendEmail } from "@/server/email";
import { getPaymentInfo, verifyCallbackSignature, type CallbackPayload } from "@/server/maib";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as CallbackPayload | null;
  if (!payload || !verifyCallbackSignature(payload)) {
    console.warn("[payments] callback with a bad signature");
    return new Response("Bad signature", { status: 400 });
  }

  const { payId, orderId, status } = payload.result;
  console.info(`[payments] callback ${orderId} ${payId}: ${status}`);

  if (status === "OK" && typeof payId === "string") {
    try {
      // pay-info has the buyer's e-mail and the items, so the e-mail can be sent without a database
      const payment = await getPaymentInfo(payId);
      const email = paymentConfirmationEmail(payment, new Date());
      if (email) await sendEmail(email);
    } catch (error) {
      // Still answer 200: a retry would not help and could send the e-mail twice
      console.error(`[payments] confirmation e-mail for ${orderId} failed`, error);
    }
    // TODO: mark the order as paid, issue the e-tickets and release the seat hold (needs the database)
  }

  return new Response("OK", { status: 200 });
}
