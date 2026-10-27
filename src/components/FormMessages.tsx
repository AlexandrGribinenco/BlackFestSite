"use client";

import { useEffect } from "react";

type Field = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

function messageFor(field: Field): string {
  const { validity, type } = field;
  if (validity.valueMissing) {
    if (type === "checkbox") return "Please tick this box to continue.";
    if (type === "radio" || field instanceof HTMLSelectElement) return "Please choose one of the options.";
    return "Please fill in this field.";
  }
  if (validity.typeMismatch && type === "email") return "Please enter a valid e-mail address, e.g. name@example.com.";
  if (validity.typeMismatch && type === "url") return "Please enter a valid web address.";
  return "Please check this field.";
}

// The browser writes its form hints ("Заполните это поле.") in the language of the browser, not of the page.
// This gives every required field on the site English hints instead. A message a form sets itself, such as
// "Emails don’t match", is left as it is.
export function FormMessages() {
  useEffect(() => {
    function onInvalid(e: Event) {
      const field = e.target;
      if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)) return;
      if (field.validity.customError) return;

      field.setCustomValidity(messageFor(field));
      // The custom text keeps the field invalid, so it is cleared on the next edit and the browser checks again
      const reset = () => field.setCustomValidity("");
      field.addEventListener("input", reset, { once: true });
      field.addEventListener("change", reset, { once: true });
    }

    // "invalid" doesn't bubble, so it is caught on the way down
    document.addEventListener("invalid", onInvalid, true);
    return () => document.removeEventListener("invalid", onInvalid, true);
  }, []);

  return null;
}
