"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { PaymentMethods } from "../checkout/PaymentMethods";

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
        <PaymentMethods />

        <div className="consents">
          <label className="checkbox">
            <input type="checkbox" name="acceptTerms" required />
            <span>
              I have read and agree to the <Link href="/legal/terms">Terms &amp; Conditions</Link>, including the return policy *
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
