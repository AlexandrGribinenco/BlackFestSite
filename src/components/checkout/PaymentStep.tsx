"use client";

import type { FormEvent } from "react";
import type { Order } from "@/lib/checkout";
import { OrderLines } from "./OrderSummary";
import { PaymentMethods } from "./PaymentMethods";

export const PAYMENT_FORM_ID = "checkout-payment";

type PaymentStepProps = {
  order: Order;
  /** Why the payment could not be started, shown above the button */
  error: string | null;
  onSubmit: () => void;
  onBack: () => void;
};

// Step 4 (Figma: D3 "sec4" 2:1657, M4.4 51:520).
// The card is entered on the maib payment page, not here: maib e-commerce redirects the buyer to its own page
// (card, Apple Pay, Google Pay, 3-D Secure) and back. So the card fields of the wireframe are left out.
export function PaymentStep({ order, error, onSubmit, onBack }: PaymentStepProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <section aria-labelledby="checkout-step-title">
      <h1 className="checkout-title" id="checkout-step-title">
        <span className="only-desktop">Step 4. </span>Payment
      </h1>

      <form className="checkout-form" id={PAYMENT_FORM_ID} noValidate onSubmit={handleSubmit}>
        <PaymentMethods />

        <p className="pay-note">
          Payments are processed securely by maib. Your card details are entered on the maib page and never reach this site. Your bank may
          ask you to confirm the payment (3-D Secure).
        </p>

        {error && (
          <p className="pay-error" role="alert">
            {error}
          </p>
        )}
      </form>

      {/* On mobile the order summary card is hidden, so the lines are repeated here (Figma: M4.4) */}
      <div className="checkout-mobile-lines">
        <OrderLines order={order} />
      </div>

      <button className="btn btn-outline checkout-back" type="button" onClick={onBack}>
        Back
      </button>
    </section>
  );
}
