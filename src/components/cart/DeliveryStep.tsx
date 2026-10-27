"use client";

import type { ChangeEvent, FormEvent } from "react";
import { cx } from "@/lib/cx";
import { DELIVERY_METHODS, type DeliveryMethod } from "@/lib/shop";

export type ShopContact = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
};

export const EMPTY_CONTACT: ShopContact = { firstName: "", lastName: "", email: "", phone: "", address: "", city: "", postalCode: "" };

export const DELIVERY_FORM_ID = "cart-delivery";

type DeliveryStepProps = {
  /** False when the cart has only digital products: then only the contacts are asked */
  needsDelivery: boolean;
  method: DeliveryMethod;
  onMethodChange: (id: DeliveryMethod["id"]) => void;
  contact: ShopContact;
  onChange: (contact: ShopContact) => void;
  onSubmit: () => void;
  onBack: () => void;
};

// Step 2 (Figma: D12 "Delivery & contact" 347:141, M11 3:12334). The submit button lives in the order summary / mobile bar.
export function DeliveryStep({ needsDelivery, method, onMethodChange, contact, onChange, onSubmit, onBack }: DeliveryStepProps) {
  const courier = needsDelivery && method.address;

  function update(e: ChangeEvent<HTMLInputElement>) {
    onChange({ ...contact, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (e.currentTarget.reportValidity()) onSubmit();
  }

  return (
    <section aria-labelledby="checkout-step-title">
      <h1 className="checkout-title" id="checkout-step-title">
        {needsDelivery ? "Delivery & contact" : "Contact details"}
      </h1>
      {!needsDelivery && <p className="checkout-subtitle">The download link is sent to this e-mail.</p>}

      <form className="checkout-form" id={DELIVERY_FORM_ID} noValidate onSubmit={handleSubmit}>
        {needsDelivery && (
          <fieldset className="delivery-options">
            <legend className="visually-hidden">Delivery</legend>
            {DELIVERY_METHODS.map((option) => (
              <label key={option.id} className={cx("delivery-option", option.id === method.id && "is-selected")}>
                <input type="radio" name="delivery" value={option.id} checked={option.id === method.id} onChange={() => onMethodChange(option.id)} />
                <span className="delivery-option__text">
                  <strong>{option.name}</strong>
                  <small>{option.note}</small>
                </span>
                <span className="delivery-option__price">{option.price}</span>
              </label>
            ))}
          </fieldset>
        )}

        <div className="form-grid">
          <Field label="First name" name="firstName" autoComplete="given-name" required value={contact.firstName} onChange={update} />
          <Field label="Last name" name="lastName" autoComplete="family-name" required value={contact.lastName} onChange={update} />
          <Field label="Email" name="email" type="email" autoComplete="email" required value={contact.email} onChange={update} />
          <Field label="Phone" name="phone" type="tel" autoComplete="tel" placeholder="+373" required value={contact.phone} onChange={update} />
          {needsDelivery && (
            <>
              <Field
                label="Address (for courier delivery)"
                name="address"
                autoComplete="street-address"
                required={courier}
                wide
                value={contact.address}
                onChange={update}
              />
              <Field label="City" name="city" autoComplete="address-level2" required={courier} value={contact.city} onChange={update} />
              <Field
                label="Postal code"
                name="postalCode"
                autoComplete="postal-code"
                required={method.id === "moldova"}
                value={contact.postalCode}
                onChange={update}
              />
            </>
          )}
        </div>
      </form>

      <button className="btn btn-outline checkout-back" type="button" onClick={onBack}>
        Back to cart
      </button>
    </section>
  );
}

type FieldProps = {
  label: string;
  name: keyof ShopContact;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  /** Across both columns */
  wide?: boolean;
};

function Field({ label, name, value, onChange, type = "text", required = false, autoComplete, placeholder, wide = false }: FieldProps) {
  const id = `cart-${name}`;
  return (
    <div className={cx("field", wide && "field--wide")}>
      <label className="field-label" htmlFor={id}>
        {label}
        {required && " *"}
      </label>
      <input
        className="input"
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
      />
    </div>
  );
}
