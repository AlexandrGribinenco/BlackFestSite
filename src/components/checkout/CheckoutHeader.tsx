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
  /** Time (ms) when the seat hold ends; null until the page is mounted */
  holdUntil: number | null;
  onHoldExpire: () => void;
};

// Figma: D3 header (logo, seat hold, back link); M4 header (back arrow, title, hold)
export function CheckoutHeader({ onBack, showTimer, holdUntil, onHoldExpire }: CheckoutHeaderProps) {
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
          {showTimer && <HoldTimer holdUntil={holdUntil} onExpire={onHoldExpire} />}
          <Link className="checkout-header__back" href="/tickets">
            Back to tickets
          </Link>
        </div>
      </div>
    </header>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

export const formatClock = (seconds: number) => `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;

/** Seconds left until `until` (ms), ticking every second; the full hold while `until` is not set yet */
export function useSecondsLeft(until: number | null): number {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (until === null || now === null) return HOLD_SECONDS;
  return Math.max(0, Math.ceil((until - now) / 1000));
}

function HoldTimer({ holdUntil, onExpire }: { holdUntil: number | null; onExpire: () => void }) {
  const secondsLeft = useSecondsLeft(holdUntil);

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
      {formatClock(secondsLeft)}
    </p>
  );
}
