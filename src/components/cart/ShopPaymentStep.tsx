"use client";

import Link from "next/link";
import type { FormEvent } from "react";

export const SHOP_PAYMENT_FORM_ID = "cart-payment";

type ShopPaymentStepProps = {
  error: string | null;
  onSubmit: () => void;
  onBack: () => void;
};

// Step 3 (Figma: D12 "Payment" 347:141, M11 3:12334). As in the ticket checkout, the card is entered on the maib page,
// so the card fields of the wireframe are left out. maib requires the Terms & Conditions to be accepted before paying.
export function ShopPaymentStep({ error, onSubmit, onBack }: ShopPaymentStepProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (e.currentTarget.reportValidity()) onSubmit();
  }

  return (
    <section aria-labelledby="checkout-step-title">
      <h1 className="checkout-title" id="checkout-step-title">
        Payment
      </h1>

      <form className="checkout-form" id={SHOP_PAYMENT_FORM_ID} noValidate onSubmit={handleSubmit}>
        <div className="pay-options">
          <div className="pay-option is-selected">
            <p className="pay-option__head">
              <span className="pay-option__name">Card, Apple Pay or Google Pay</span>
              <span className="pay-option__brands">Visa · Mastercard · American Express</span>
            </p>
            <p className="pay-option__text">
              After you press Pay, you go to the secure maib payment page to enter your card or choose Apple Pay / Google Pay, then come back
              here.
            </p>
          </div>
        </div>

        <div className="consents">
          <label className="checkbox">
            <input type="checkbox" name="acceptTerms" required />
            <span>
              I agree to the <Link href="/legal/terms">Terms &amp; Conditions</Link> (incl. returns) *
            </span>
          </label>
          <label className="checkbox">
            <input type="checkbox" name="acceptPrivacy" required />
            <span>
              I agree to the <Link href="/legal/personal-data">Personal Data Processing Agreement</Link> *
            </span>
          </label>
        </div>

        {error && (
          <p className="pay-error" role="alert">
            {error}
          </p>
        )}
      </form>

      <button className="btn btn-outline checkout-back" type="button" onClick={onBack}>
        Back
      </button>
    </section>
  );
}
