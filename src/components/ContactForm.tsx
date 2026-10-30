"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { COMPANY } from "@/lib/company";

const TOPICS = ["General question", "Tickets & orders", "Partners & advertising", "Press"];

// Figma: D6 "Write to us". TODO: send messages to the organizer's inbox once a form backend is chosen.
export function ContactForm() {
  const [status, setStatus] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    setStatus(`The form isn’t connected yet — please write to ${COMPANY.email} for now.`);
  }

  return (
    <form className="contact-form" noValidate onSubmit={handleSubmit} aria-labelledby="contact-form-title">
      <h2 className="contact-form__title" id="contact-form-title">
        Write to us
      </h2>

      <div className="contact-form__grid">
        <div className="field">
          <label className="field-label" htmlFor="contact-name">
            Name *
          </label>
          <input className="input" id="contact-name" name="name" autoComplete="name" required />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="contact-email">
            Email *
          </label>
          <input className="input" id="contact-email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field contact-form__wide">
          <label className="field-label" htmlFor="contact-topic">
            Topic
          </label>
          <select className="input" id="contact-topic" name="topic" defaultValue="">
            <option value="" disabled>
              Choose a topic
            </option>
            {TOPICS.map((topic) => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
        </div>
        <div className="field contact-form__wide">
          <label className="field-label" htmlFor="contact-message">
            Message *
          </label>
          <textarea className="input contact-form__message" id="contact-message" name="message" rows={4} required />
        </div>
      </div>

      <label className="checkbox">
        <input type="checkbox" name="consent" required />
        <span>
          I agree to the <Link href="/legal/personal-data">Personal Data Processing Agreement</Link> *
        </span>
      </label>

      <button className="btn btn-primary" type="submit">
        Send message
      </button>

      {status && (
        <p className="contact-form__status" role="status">
          {status}
        </p>
      )}
    </form>
  );
}
