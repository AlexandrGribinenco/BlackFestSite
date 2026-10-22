"use client";

import type { FormEvent } from "react";

export function NewsletterForm() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    // TODO: send form data to the mailing service once it is chosen
  }

  return (
    <form className="newsletter__form" noValidate onSubmit={handleSubmit}>
      <label className="field-label" htmlFor="newsletter-email">
        Email
      </label>
      <div className="newsletter__row">
        <input className="input" id="newsletter-email" name="email" type="email" autoComplete="email" required />
        <button className="btn btn-outline" type="submit">
          Sign up
        </button>
      </div>
      <label className="checkbox">
        <input type="checkbox" name="consent" required />
        <span>I agree to receive emails and can unsubscribe at any time.</span>
      </label>
    </form>
  );
}
