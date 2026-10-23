"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { HOLD_SECONDS } from "@/lib/checkout";
import { cx } from "@/lib/cx";
import { EVENT } from "@/lib/event";

type CheckoutHeaderProps = {
  /** Previous step, or back to the Tickets page on step 1; hidden when null */
  onBack: (() => void) | null;
  showTimer: boolean;
  /** Changing the key restarts the seat hold */
  holdKey: number;
  onHoldExpire: () => void;
};

// Figma: D3 header (logo, seat hold, back link); M4 header (back arrow, title, hold)
export function CheckoutHeader({ onBack, showTimer, holdKey, onHoldExpire }: CheckoutHeaderProps) {
  return (
    <header className="checkout-header">
      <div className="container checkout-header__inner">
        {onBack ? (
          <button className="checkout-header__arrow" type="button" aria-label="Back" onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
          </button>
        ) : (
          <span className="checkout-header__arrow" aria-hidden="true" />
        )}

        <div className="checkout-header__logo">
          <Logo />
        </div>
        <p className="checkout-header__title">{EVENT.name}</p>

        <div className="checkout-header__actions">
          {showTimer && <HoldTimer key={holdKey} onExpire={onHoldExpire} />}
          <Link className="checkout-header__back" href="/tickets">
            ← Back to tickets
          </Link>
        </div>
      </div>
    </header>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

function HoldTimer({ onExpire }: { onExpire: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(HOLD_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) onExpire();
  }, [secondsLeft, onExpire]);

  return (
    <p className={cx("hold-timer", secondsLeft === 0 && "hold-timer--expired")} role="timer" aria-label="Seats are held for">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2 2M9 2h6" />
      </svg>
      <span className="only-desktop">Seats held </span>
      {pad(Math.floor(secondsLeft / 60))}:{pad(secondsLeft % 60)}
    </p>
  );
}
