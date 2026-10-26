import { cx } from "@/lib/cx";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Layers of public/images/coming-soon.svg
const BACKGROUND_SRC = `${BASE_PATH}/images/coming-soon-bg.svg`;
const TEXT_SRC = `${BASE_PATH}/images/coming-soon-text.svg`;

type ComingSoonImageProps = {
  /** Empty for decorative images, e.g. when a link label already names the tile */
  alt: string;
  className?: string;
  /** Load right away (above the fold) instead of lazily */
  priority?: boolean;
};

// Temporary artwork until real photos arrive. Fills its positioned parent at any proportions:
// the aurora background covers the box, the text is a separate layer scaled to the box, so nothing is cropped.
export function ComingSoonImage({ alt, className, priority = false }: ComingSoonImageProps) {
  const loading = priority ? "eager" : "lazy";

  return (
    <span className={cx("coming-soon", className)}>
      <img className="coming-soon__bg" src={BACKGROUND_SRC} alt="" aria-hidden="true" loading={loading} decoding="async" />
      <img className="coming-soon__text" src={TEXT_SRC} alt={alt} loading={loading} decoding="async" />
    </span>
  );
}
