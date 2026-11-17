"use client";

import { useState } from "react";
import { APPLE_PAY_MARK, GOOGLE_PAY_MARK, walletMarkSrc, type WalletMark } from "@/lib/wallets";

// Card, Apple Pay and Google Pay as separate choices, as the client asked (17.11.2026). All three are paid on the maib
// payment page, which offers each of them there, so the choice here only changes the hint under the option.
// Apple Pay and Google Pay show their official marks (17.11.2026).
const METHODS: Array<{ id: string; name: string; brands?: string; mark?: WalletMark; text: string }> = [
  {
    id: "card",
    name: "Card",
    brands: "Visa · Mastercard · American Express",
    text: "You enter your card on the secure maib payment page, then come back here.",
  },
  {
    id: "apple-pay",
    name: "Apple Pay",
    mark: APPLE_PAY_MARK,
    text: "You confirm the payment with Apple Pay on the maib payment page. Available on Apple devices with a card in Apple Wallet.",
  },
  {
    id: "google-pay",
    name: "Google Pay",
    mark: GOOGLE_PAY_MARK,
    text: "You confirm the payment with Google Pay on the maib payment page. Available if you have a card saved in Google Pay.",
  },
];

export function PaymentMethods() {
  const [selected, setSelected] = useState(METHODS[0].id);

  return (
    <fieldset className="pay-options">
      <legend className="visually-hidden">Payment method</legend>
      {METHODS.map((method) => (
        <div key={method.id} className={method.id === selected ? "pay-option is-selected" : "pay-option"}>
          <label className="pay-option__head">
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={method.id === selected}
              onChange={() => setSelected(method.id)}
            />
            <span className="pay-option__name">{method.name}</span>
            {method.brands && <span className="pay-option__brands">{method.brands}</span>}
            {method.mark && (
              // The name is printed next to it, so the mark needs no alt text
              <img className="pay-option__mark" src={walletMarkSrc(method.mark)} alt="" width={method.mark.width} height={method.mark.height} />
            )}
          </label>
          {method.id === selected && <p className="pay-option__text">{method.text}</p>}
        </div>
      ))}
    </fieldset>
  );
}
