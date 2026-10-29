import { cx } from "@/lib/cx";
import type { Partner } from "@/lib/partners";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type PartnerLogoProps = {
  partner: Partner;
  /** The name is printed next to it, so the logo needs no alt text */
  decorative?: boolean;
  className?: string;
};

// Partner's logo, sized by --logo-h in its box; the name stands in while there is no logo file
export function PartnerLogo({ partner, decorative = false, className }: PartnerLogoProps) {
  if (!partner.logo) {
    return (
      <span className={cx("partner-logo partner-logo--text", className)} aria-hidden={decorative || undefined}>
        {partner.name}
      </span>
    );
  }
  return (
    <img
      className={cx("partner-logo", className)}
      src={`${BASE_PATH}/images/partners/${partner.logo.file}`}
      alt={decorative ? "" : partner.name}
      width={Math.round(40 * partner.logo.ratio)}
      height={40}
      loading="lazy"
      decoding="async"
    />
  );
}
