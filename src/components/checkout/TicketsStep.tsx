"use client";

import { useState, type FormEvent } from "react";
import { AdaptiveText } from "@/components/AdaptiveText";
import { ADDONS, TICKET_TYPES, type Order } from "@/lib/checkout";
import { cx } from "@/lib/cx";
import { QuantityStepper } from "./QuantityStepper";

type TicketsStepProps = {
  order: Order;
  onTicketChange: (id: string, qty: number) => void;
  onAddonChange: (id: string, qty: number) => void;
};

// Step 1 (Figma: D3 "sec1" 2:593, M4.1 51:351)
export function TicketsStep({ order, onTicketChange, onAddonChange }: TicketsStepProps) {
  const [promoOpen, setPromoOpen] = useState(false);

  return (
    <section aria-labelledby="checkout-step-title">
      <h1 className="checkout-title" id="checkout-step-title">
        <span className="only-desktop">Step 1. </span>Choose tickets
      </h1>
      <p className="checkout-subtitle">
        Prices include all taxes.{" "}
        <button className="link-button" type="button" aria-expanded={promoOpen} onClick={() => setPromoOpen((open) => !open)}>
          Got a promo code?
        </button>
      </p>
      {promoOpen && <PromoCode />}

      <ul className="ticket-list">
        {TICKET_TYPES.map((type) => {
          const qty = order.tickets[type.id] ?? 0;
          return (
            <li key={type.id} className={cx("ticket-row", qty > 0 && "is-selected", type.soldOut && "is-sold-out")}>
              <div className="ticket-row__info">
                <h3 className="ticket-row__name">{type.name}</h3>
                <p className="ticket-row__desc">
                  <AdaptiveText full={type.description} short={type.shortDescription} />
                </p>
              </div>
              <div className="ticket-row__price">
                <p className="ticket-row__amount">{type.price}</p>
                <p className="ticket-row__phase">{type.phase}</p>
              </div>
              {type.soldOut ? (
                <p className="ticket-row__sold-out">Sold out</p>
              ) : (
                <QuantityStepper label={type.name} value={qty} onChange={(value) => onTicketChange(type.id, value)} />
              )}
            </li>
          );
        })}
      </ul>

      <h2 className="checkout-subheading">Add-ons</h2>
      <ul className="ticket-list">
        {ADDONS.map((addon) => {
          const qty = order.addons[addon.id] ?? 0;
          return (
            <li key={addon.id} className={cx("ticket-row", qty > 0 && "is-selected")}>
              <div className="ticket-row__info">
                <h3 className="ticket-row__name">{addon.name}</h3>
                <p className="ticket-row__desc">{addon.description}</p>
              </div>
              <div className="ticket-row__price">
                <p className="ticket-row__amount">{addon.price}</p>
              </div>
              <QuantityStepper label={addon.name} value={qty} onChange={(value) => onAddonChange(addon.id, value)} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function PromoCode() {
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: validate the code with the ticketing backend
    setMessage("Promo codes aren’t available yet.");
  }

  return (
    <form className="promo" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="promo-code">
        Promo code
      </label>
      <input className="input" id="promo-code" name="promo" placeholder="Promo code" autoComplete="off" />
      <button className="btn btn-outline" type="submit">
        Apply
      </button>
      {message && (
        <p className="promo__message" role="status">
          {message}
        </p>
      )}
    </form>
  );
}
