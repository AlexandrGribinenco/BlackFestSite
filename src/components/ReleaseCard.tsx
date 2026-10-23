import { cx } from "@/lib/cx";

export type ReleaseStatus = "sold-out" | "on-sale" | "coming-soon";

const STATUS_LABEL: Record<ReleaseStatus, string> = {
  "sold-out": "Sold out",
  "on-sale": "On sale",
  "coming-soon": "Coming soon",
};

export type ReleaseCardProps = {
  title: string;
  status: ReleaseStatus;
  meta: string;
  price: string;
  /** Short status shown next to the title in the mobile list, e.g. "sold out" */
  mobileNote: string;
  /** The release on sale now; on mobile it is shown in the phase card instead */
  current?: boolean;
};

export function ReleaseCard({ title, status, meta, price, mobileNote, current = false }: ReleaseCardProps) {
  return (
    <article className={cx("release-card", current && "release-card--current")}>
      <div className="release-card__head">
        <h3 className="release-card__title">
          {title}
          <span className="release-card__note"> · {mobileNote}</span>
        </h3>
        <span className="badge badge--outline">{STATUS_LABEL[status]}</span>
      </div>
      <p className="release-card__meta">{meta}</p>
      <p className="release-card__price">{price}</p>
    </article>
  );
}
