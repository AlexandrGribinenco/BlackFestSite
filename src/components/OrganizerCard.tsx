import Link from "next/link";
import { ComingSoonImage } from "./ComingSoonImage";
import { Skeleton } from "./Skeleton";

export type OrganizerCardProps = {
  badge: string;
  title: string;
  link?: { href: string; label: string };
};

export function OrganizerCard({ badge, title, link }: OrganizerCardProps) {
  return (
    <article className="org-card">
      <div className="placeholder org-card__photo">
        <ComingSoonImage alt={`${title} — photo coming soon`} />
      </div>
      <div className="org-card__body">
        <span className="badge badge--outline">{badge}</span>
        <h3 className="org-card__title">{title}</h3>
        <Skeleton size="sm" widths={[undefined, "60%"]} />
        {link && (
          <Link className="link-arrow" href={link.href}>
            {link.label} →
          </Link>
        )}
      </div>
    </article>
  );
}
