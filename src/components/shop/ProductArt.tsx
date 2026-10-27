import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";
import type { FrameColor, ShopProduct } from "@/lib/shop";
import { ComingSoonImage } from "../ComingSoonImage";
import "./product-art.css";

// Product mock-ups drawn in CSS around the placeholder artwork (Figma: 04 · Colors / D10 · Shop).
// They stand in for product photos until the real ones are made.

type ArtProps = { alt: string; className?: string };

/** Album sleeve with the record sliding out to the right */
export function VinylArt({ alt, className }: ArtProps) {
  return (
    <div className={cx("vinyl-art", className)}>
      <span className="vinyl-art__disc" aria-hidden="true" />
      <div className="vinyl-art__sleeve">
        <ComingSoonImage alt={alt} />
      </div>
    </div>
  );
}

const FRAME_COLORS: Record<FrameColor, string> = {
  black: "#0b0714",
  white: "#f4f0ff",
  grey: "#9a8fb3",
};

/** Artwork in a frame with a white mat */
export function PrintArt({ alt, frame = "black", className }: ArtProps & { frame?: FrameColor }) {
  return (
    <div className={cx("print-art", className)} style={{ "--frame": FRAME_COLORS[frame] } as CSSProperties}>
      <div className="print-art__mat">
        <div className="print-art__picture">
          <ComingSoonImage alt={alt} />
        </div>
      </div>
    </div>
  );
}

export function PosterArt({ alt, className }: ArtProps) {
  return (
    <div className={cx("poster-art", className)}>
      <ComingSoonImage alt={alt} />
    </div>
  );
}

/** Magazine cover with a few pages fanned out behind it */
export function JournalArt({ alt, className }: ArtProps) {
  return (
    <div className={cx("journal-art", className)} role="img" aria-label={alt}>
      <span className="journal-art__pages" aria-hidden="true" />
      <span className="journal-art__cover" aria-hidden="true">
        E-journal
        <br />
        #01
      </span>
    </div>
  );
}

const isFrameColor = (value: string | undefined): value is FrameColor => value !== undefined && value in FRAME_COLORS;

/** The mock-up that stands in for a product's photo; a framed print takes the picked frame colour */
export function ProductArt({ product, alt, frame, className }: ArtProps & { product: ShopProduct; frame?: string }) {
  switch (product.visual) {
    case "vinyl":
      return <VinylArt alt={alt} className={className} />;
    case "print":
      return <PrintArt alt={alt} className={className} frame={isFrameColor(frame) ? frame : undefined} />;
    case "poster":
      return <PosterArt alt={alt} className={className} />;
    case "journal":
      return <JournalArt alt={alt} className={className} />;
  }
}
