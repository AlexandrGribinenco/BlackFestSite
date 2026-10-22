import Link from "next/link";
import { Skeleton } from "./Skeleton";

export type TicketCardProps = {
  phase: string;
  title: string;
  price: string;
  status: "on-sale" | "sold-out";
  href: string;
};

export function TicketCard({ phase, title, price, status, href }: TicketCardProps) {
  const soldOut = status === "sold-out";

  return (
    <article className="ticket-card">
      <div className="ticket-card__top">
        <span className="ticket-card__phase">{phase}</span>
        <span className="badge badge--outline">{soldOut ? "Sold out" : "On sale"}</span>
      </div>
      <h3 className="ticket-card__title">{title}</h3>
      <p className="ticket-card__price">{price}</p>
      <Skeleton size="sm" widths={[undefined, "70%"]} />
      {soldOut ? (
        <button className="btn btn-outline btn-block" type="button" disabled>
          Sold out
        </button>
      ) : (
        <Link className="btn btn-outline btn-block" href={href}>
          Buy
        </Link>
      )}
    </article>
  );
}
