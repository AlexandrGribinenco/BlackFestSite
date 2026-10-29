import { cx } from "@/lib/cx";
import { externalLinkProps } from "@/lib/links";
import type { Partner } from "@/lib/partners";
import { PartnerLogo } from "./PartnerLogo";

type PartnerTileProps = {
  partner: Partner;
  featured?: boolean;
};

// Partner card on the Partners page (Figma: D14 "Grid · General partner", "Grid · Partners", "Grid · Media partners")
export function PartnerTile({ partner, featured = false }: PartnerTileProps) {
  return (
    <article className={cx("partner-tile", featured && "partner-tile--featured")}>
      <div className="partner-tile__logo">
        <PartnerLogo partner={partner} decorative />
      </div>
      <h3 className="partner-tile__name">{partner.title ?? partner.name}</h3>
      {partner.category && <p className="partner-tile__category">{partner.category}</p>}
      {partner.description && <p className="partner-tile__text">{partner.description}</p>}
      <a className="partner-tile__link" href={partner.url} {...externalLinkProps(partner.url)}>
        Website
      </a>
    </article>
  );
}
