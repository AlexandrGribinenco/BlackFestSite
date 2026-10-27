"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { COMPANY } from "@/lib/company";
import { PAYMENTS_CONNECTED, fetchPaymentResult, type PaymentResult as Result } from "@/lib/payments";
import { CheckoutHeader } from "./CheckoutHeader";

type State = { kind: "loading" } | { kind: "error"; message: string } | { kind: "result"; payment: Result };

const money = (amount: number, currency: string) => `${amount.toFixed(2)} ${currency}`;

// Page the buyer returns to from the maib payment page (okUrl and failUrl, with ?payId=…&orderId=…).
// maib requires it to show the order number, the order details and the payment date.
export function PaymentResult() {
  const params = useSearchParams();
  const payId = params.get("payId");
  const orderId = params.get("orderId");
  const [state, setState] = useState<State>({ kind: "loading" });

  const check = useCallback(async () => {
    if (!PAYMENTS_CONNECTED) return setState({ kind: "error", message: "Online payment is not connected on this site yet." });
    if (!payId) return setState({ kind: "error", message: "The payment link is incomplete." });
    setState({ kind: "loading" });
    const result = await fetchPaymentResult(payId);
    setState("error" in result ? { kind: "error", message: result.error } : { kind: "result", payment: result });
  }, [payId]);

  useEffect(() => {
    check();
  }, [check]);

  return (
    <>
      <CheckoutHeader onBack={null} showTimer={false} holdUntil={null} onHoldExpire={() => {}} />
      <main className="checkout">
        <div className="container">{renderState()}</div>
      </main>
    </>
  );

  function renderState() {
    if (state.kind === "loading") {
      return (
        <section className="done" aria-busy="true">
          <p className="done__text">Checking your payment…</p>
        </section>
      );
    }

    if (state.kind === "error") {
      return (
        <section className="payment-failed" role="alert">
          <h1 className="payment-failed__title">We couldn’t check this payment</h1>
          <p className="payment-failed__text">
            {state.message} {orderId && <>Order {orderId}. </>}If money was taken from your card, write to {COMPANY.email} — we will sort it out.
          </p>
          <div className="payment-failed__actions">
            <button className="btn btn-outline" type="button" onClick={check}>
              Check again
            </button>
          </div>
        </section>
      );
    }

    const { payment } = state;
    const number = payment.orderId ?? orderId ?? payment.payId;

    if (payment.status === "CREATED" || payment.status === "PENDING") {
      return (
        <section className="done" aria-live="polite">
          <h1 className="done__title">Payment is being processed</h1>
          <p className="done__text">Order {number}. This usually takes a few seconds.</p>
          <div className="done__actions">
            <button className="btn btn-outline" type="button" onClick={check}>
              Check again
            </button>
          </div>
        </section>
      );
    }

    if (payment.status !== "OK") {
      return (
        <section className="payment-failed" role="alert" aria-labelledby="payment-result-title">
          <h1 className="payment-failed__title" id="payment-result-title">
            Payment didn’t go through
          </h1>
          <p className="payment-failed__text">
            Your card was not charged. Order {number}
            {payment.status === "TIMEOUT" ? " — the payment page timed out." : "."}
          </p>
          <div className="payment-failed__actions">
            <Link className="btn btn-primary btn-ring" href="/checkout">
              Try again
            </Link>
          </div>
        </section>
      );
    }

    return (
      <section className="done" aria-labelledby="payment-result-title">
        <div className="done__icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>
        <h1 className="done__title" id="payment-result-title">
          Payment successful!
        </h1>
        <p className="done__text">A confirmation is on its way to your e-mail.</p>

        <dl className="pay-result">
          <div>
            <dt>Order number</dt>
            <dd>{number}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{new Date(payment.checkedAt).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })}</dd>
          </div>
          <div>
            <dt>Paid</dt>
            <dd>{money(payment.amount, payment.currency)}</dd>
          </div>
          <div>
            <dt>Merchant</dt>
            <dd>{COMPANY.legalName}</dd>
          </div>
        </dl>

        {payment.items.length > 0 && (
          <ul className="pay-result__items">
            {payment.items.map((item) => (
              <li key={`${item.id}-${item.name}`}>
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{money(item.price * item.quantity, payment.currency)}</span>
              </li>
            ))}
          </ul>
        )}

        <p className="done__help">
          No e-mail? Check your spam folder or <Link href="/contacts">contact us</Link>.
        </p>
      </section>
    );
  }
}
