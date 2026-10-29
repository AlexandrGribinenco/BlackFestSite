// Browser side of the maib card payment (server routes: app/api/payments).
// NEXT_PUBLIC_PAYMENTS_API_URL says where those routes are: "" when the site runs on the same server, or the API
// server's address when the site itself is static (GitHub Pages). Not set: online payment is not connected and the
// checkout only simulates it, as on the test site today.
import type { Order } from "./checkout";

const API_URL = process.env.NEXT_PUBLIC_PAYMENTS_API_URL;

export const PAYMENTS_CONNECTED = API_URL !== undefined;

type Customer = { firstName: string; lastName: string; email: string; phone: string };

/** Creates the payment on the server; the buyer then goes to the maib payment page (payUrl) */
export async function startPayment(order: Order, customer: Customer, acceptTerms: boolean): Promise<{ payUrl: string } | { error: string }> {
  try {
    const response = await fetch(`${API_URL}/api/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order, customer, acceptTerms }),
    });
    const data = await response.json();
    return response.ok && data.payUrl ? { payUrl: data.payUrl } : { error: data.error ?? "Payment could not be started" };
  } catch {
    return { error: "No connection to the payment service. Please try again." };
  }
}

export type PaymentResult = {
  checkoutId: string;
  orderId?: string;
  /** Paid, still in progress, or not paid */
  status: "OK" | "PENDING" | "FAILED";
  amount: number;
  currency: string;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
  /** When the payment went through */
  paidAt: string | null;
  checkedAt: string;
};

/** checkoutId comes in the address maib sends the buyer back to */
export async function fetchPaymentResult(checkoutId: string): Promise<PaymentResult | { error: string }> {
  try {
    const response = await fetch(`${API_URL}/api/payments/${encodeURIComponent(checkoutId)}`, { cache: "no-store" });
    const data = await response.json();
    return response.ok ? (data as PaymentResult) : { error: data.error ?? "Unknown payment" };
  } catch {
    return { error: "No connection to the payment service" };
  }
}
