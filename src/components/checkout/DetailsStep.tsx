"use client";

import Link from "next/link";
import { useRef, type ChangeEvent, type FormEvent, type HTMLAttributes, type Ref } from "react";

export type CustomerDetails = {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  phone: string;
  country: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  newsletter: boolean;
};

export const EMPTY_DETAILS: CustomerDetails = {
  firstName: "",
  lastName: "",
  email: "",
  confirmEmail: "",
  phone: "",
  country: "",
  acceptTerms: false,
  acceptPrivacy: false,
  newsletter: false,
};

export const DETAILS_FORM_ID = "checkout-details";

type DetailsStepProps = {
  details: CustomerDetails;
  onChange: (details: CustomerDetails) => void;
  onSubmit: () => void;
  onBack: () => void;
};

// Step 3 (Figma: D3 "sec3" 2:1466, M4.3 51:469). The submit button lives in the order summary / mobile bar.
export function DetailsStep({ details, onChange, onSubmit, onBack }: DetailsStepProps) {
  const confirmRef = useRef<HTMLInputElement>(null);

  function update(e: ChangeEvent<HTMLInputElement>) {
    const { name, type, value, checked } = e.target;
    if (name === "confirmEmail" || name === "email") confirmRef.current?.setCustomValidity("");
    onChange({ ...details, [name]: type === "checkbox" ? checked : value });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const sameEmail = details.email.trim().toLowerCase() === details.confirmEmail.trim().toLowerCase();
    confirmRef.current?.setCustomValidity(sameEmail ? "" : "Emails don’t match");
    if (!e.currentTarget.reportValidity()) return;
    onSubmit();
  }

  return (
    <section aria-labelledby="checkout-step-title">
      <h1 className="checkout-title" id="checkout-step-title">
        <span className="only-desktop">Step 3. </span>Your details
      </h1>
      <p className="checkout-subtitle">No account needed. Tickets are sent to this email.</p>

      <form className="checkout-form" id={DETAILS_FORM_ID} noValidate onSubmit={handleSubmit}>
        <div className="form-grid">
          <Field label="First name" name="firstName" autoComplete="given-name" required value={details.firstName} onChange={update} />
          <Field label="Last name" name="lastName" autoComplete="family-name" required value={details.lastName} onChange={update} />
          <Field label="Email" name="email" type="email" autoComplete="email" required value={details.email} onChange={update} />
          <Field
            label="Confirm email"
            name="confirmEmail"
            type="email"
            autoComplete="email"
            required
            value={details.confirmEmail}
            onChange={update}
            inputRef={confirmRef}
          />
          <Field label="Phone" name="phone" type="tel" autoComplete="tel" placeholder="+373" required value={details.phone} onChange={update} />
          <Field label="Country" name="country" autoComplete="country-name" value={details.country} onChange={update} />
        </div>

        <div className="consents">
          <label className="checkbox">
            <input type="checkbox" name="acceptTerms" required checked={details.acceptTerms} onChange={update} />
            <span>
              I agree to the <Link href="/terms">Terms &amp; Conditions</Link> and refund rules *
            </span>
          </label>
          <label className="checkbox">
            <input type="checkbox" name="acceptPrivacy" required checked={details.acceptPrivacy} onChange={update} />
            <span>
              I agree to the <Link href="/personal-data">Personal Data Processing Agreement</Link> and{" "}
              <Link href="/privacy">Privacy Policy</Link> *
            </span>
          </label>
          <label className="checkbox">
            <input type="checkbox" name="newsletter" checked={details.newsletter} onChange={update} />
            <span>Send me news about future events (optional)</span>
          </label>
        </div>
      </form>

      <button className="btn btn-outline checkout-back" type="button" onClick={onBack}>
        Back
      </button>
    </section>
  );
}

type FieldProps = {
  label: string;
  name: keyof CustomerDetails;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  inputRef?: Ref<HTMLInputElement>;
};

function Field({ label, name, value, onChange, type = "text", required = false, autoComplete, placeholder, inputMode, inputRef }: FieldProps) {
  const id = `checkout-${name}`;
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
        {required && " *"}
      </label>
      <input
        ref={inputRef}
        className="input"
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
      />
    </div>
  );
}
