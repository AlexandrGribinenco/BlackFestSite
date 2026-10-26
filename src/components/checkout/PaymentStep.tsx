"use client";

import type { FormEvent } from "react";
import type { Order } from "@/lib/checkout";
import { cx } from "@/lib/cx";
import { OrderLines } from "./OrderSummary";

export type PaymentMethod = "card" | "wallet";

export const PAYMENT_FORM_ID = "checkout-payment";

type PaymentStepProps = {
  order: Order;
  method: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  onSubmit: () => void;
  onBack: () => void;
};

// Step 4 (Figma: D3 "sec4" 2:1657, M4.4 51:520).
// TODO: replace the card fields with the payment provider's hosted fields or redirect.
// The fields here are a layout mock: they are uncontrolled, never read and never sent anywhere.
export function PaymentStep({ order, method, onMethodChange, onSubmit, onBack }: PaymentStepProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    onSubmit();
  }

  return (
    <section aria-labelledby="checkout-step-title">
      <h1 className="checkout-title" id="checkout-step-title">
        <span className="only-desktop">Step 4. </span>Payment
      </h1>

      <form className="checkout-form" id={PAYMENT_FORM_ID} noValidate autoComplete="off" onSubmit={handleSubmit}>
        <fieldset className="pay-options">
          <legend className="visually-hidden">Payment method</legend>

          <div className={cx("pay-option", method === "card" && "is-selected")}>
            <label className="pay-option__head">
              <input type="radio" name="method" value="card" checked={method === "card"} onChange={() => onMethodChange("card")} />
              <span className="pay-option__name">Bank card</span>
              <span className="pay-option__brands">Visa · Mastercard · American Express</span>
            </label>

            {method === "card" && (
              <div className="card-fields">
                <div className="field card-fields__number">
                  <label className="field-label" htmlFor="card-number">
                    Card number
                  </label>
                  <input
                    className="input"
                    id="card-number"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="0000 0000 0000 0000"
                    pattern="[0-9 ]{12,23}"
                    required
                  />
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="card-expiry">
                    Expiry
                  </label>
                  <input className="input" id="card-expiry" autoComplete="cc-exp" placeholder="MM/YY" pattern="(0[1-9]|1[0-2]) ?/? ?[0-9]{2}" required />
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="card-cvc">
                    CVC
                  </label>
                  <input className="input" id="card-cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="123" pattern="[0-9]{3,4}" required />
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="card-name">
                    Name on card
                  </label>
                  <input className="input" id="card-name" autoComplete="cc-name" required />
                </div>
              </div>
            )}
          </div>

          <div className={cx("pay-option", method === "wallet" && "is-selected")}>
            <label className="pay-option__head">
              <input type="radio" name="method" value="wallet" checked={method === "wallet"} onChange={() => onMethodChange("wallet")} />
              <span className="pay-option__name">Apple Pay / Google Pay</span>
            </label>
          </div>
        </fieldset>

        <p className="pay-note">
          You may be asked to confirm the payment in your bank app (3-D Secure). Card data is processed by the bank, not stored on this site.
        </p>
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
