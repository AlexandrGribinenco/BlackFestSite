import Link from "next/link";
import { Countdown } from "./Countdown";

type PhaseCardProps = {
  phase: string;
  price: string;
  /** Share of the current release already sold, 0–100 */
  soldPercent: number;
  /** ISO date-time of the next price step */
  priceStepAt: string;
  href: string;
};

// Current release on mobile (Figma: M3 · Tickets, "Section · Tickets (var C)")
export function PhaseCard({ phase, price, soldPercent, priceStepAt, href }: PhaseCardProps) {
  return (
    <article className="phase-card" aria-label={`${phase} on sale`}>
      <div className="phase-card__top">
        <p className="phase-card__phase">{phase} · On sale</p>
        <span className="badge badge--accent">{soldPercent}% sold</span>
      </div>
      <p className="phase-card__from">From</p>
      <p className="phase-card__price">{price}</p>
      <div
        className="progress"
        role="progressbar"
        aria-label="Tickets sold"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={soldPercent}
      >
        <span className="progress__bar" style={{ width: `${soldPercent}%` }} />
      </div>
      <Countdown
        target={priceStepAt}
        label="Time until the price goes up"
        placeholder={{ days: "12", hours: "04", minutes: "31", seconds: "08" }}
      />
      <Link className="btn btn-primary btn-block" href={href}>
        Buy tickets
      </Link>
    </article>
  );
}
