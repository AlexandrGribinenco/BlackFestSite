import { cx } from "@/lib/cx";
import { externalLinkProps } from "@/lib/links";

export type Partner = {
  name: string;
  category?: string;
  /** One or two lines about the partner (general partner only) */
  description?: string;
  url: string;
};

type PartnerTileProps = Partner & {
  featured?: boolean;
};

// Partner card on the Partners page (Figma: D14 "Grid · General partner", "Grid · Partners", "Grid · Media partners")
export function PartnerTile({ name, category, description, url, featured = false }: PartnerTileProps) {
  return (
    <article className={cx("partner-tile", featured && "partner-tile--featured")}>
      {/* TODO: partner logo */}
      <div className="placeholder partner-tile__logo">Partner logo</div>
      <h3 className="partner-tile__name">{name}</h3>
      {category && <p className="partner-tile__category">{category}</p>}
      {description && <p className="partner-tile__text">{description}</p>}
      <a className="partner-tile__link" href={url} {...externalLinkProps(url)}>
        Website
      </a>
    </article>
  );
}
