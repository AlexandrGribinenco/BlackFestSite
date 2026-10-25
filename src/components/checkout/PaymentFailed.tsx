"use client";

import { formatClock, useSecondsLeft } from "./CheckoutHeader";

type PaymentFailedProps = {
  holdUntil: number | null;
  onRetry: () => void;
  onUseAnotherCard: () => void;
};

// Figma: D8 "Payment failed (checkout step 4)"
export function PaymentFailed({ holdUntil, onRetry, onUseAnotherCard }: PaymentFailedProps) {
  const secondsLeft = useSecondsLeft(holdUntil);

  return (
    <section className="payment-failed" role="alert" aria-labelledby="payment-failed-title">
      <div className="payment-failed__icon" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </div>
      <h1 className="payment-failed__title" id="payment-failed-title">
        Payment didn’t go through
      </h1>
      <p className="payment-failed__text">
        Your card was not charged. Your seats are still held for {formatClock(secondsLeft)}.
      </p>
      <div className="payment-failed__actions">
        <button className="btn btn-primary btn-ring" type="button" onClick={onRetry}>
          Try again
        </button>
        <button className="btn btn-outline" type="button" onClick={onUseAnotherCard}>
          Use another card
        </button>
      </div>
    </section>
  );
}
