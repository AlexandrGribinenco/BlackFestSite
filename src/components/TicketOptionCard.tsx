import Link from "next/link";

export type TicketOptionCardProps = {
  category: string;
  title: string;
  price: string;
  features: string[];
  /** One-line description used instead of the feature list on mobile */
  summary: string;
  href: string;
};

export function TicketOptionCard({ category, title, price, features, summary, href }: TicketOptionCardProps) {
  return (
    <article className="option-card">
      <p className="option-card__category">{category}</p>
      <div className="option-card__head">
        <h3 className="option-card__title">{title}</h3>
        <p className="option-card__price">{price}</p>
      </div>
      <ul className="option-card__features">
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <p className="option-card__summary">{summary}</p>
      <Link className="btn btn-outline btn-block option-card__select" href={href}>
        Select
      </Link>
    </article>
  );
}
