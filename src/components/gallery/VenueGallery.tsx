"use client";

import { useState } from "react";
import { cx } from "@/lib/cx";
import { ComingSoonImage } from "../ComingSoonImage";
import { Lightbox } from "./Lightbox";

export type VenuePhoto = {
  label: string;
  /** Tile shape on desktop: two rows high or two columns wide */
  layout?: "tall" | "wide";
  /** Hidden on mobile until "Show all photos" (Figma: M5 shows five) */
  extra?: boolean;
};

// Venue photo grid (Figma: D4 "venue" 347:2808, M5 "venue" 3:10612). Any photo opens the lightbox.
export function VenueGallery({ photos }: { photos: VenuePhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const hasExtra = photos.some((photo) => photo.extra);

  return (
    <>
      <ul className={cx("venue-gallery", expanded && "is-expanded")}>
        {photos.map((photo, i) => (
          <li
            key={photo.label}
            className={cx(photo.layout && `venue-gallery__item--${photo.layout}`, photo.extra && "venue-gallery__item--extra") || undefined}
          >
            <button className="placeholder venue-gallery__photo" type="button" aria-label={`Open photo: ${photo.label}`} onClick={() => setOpenIndex(i)}>
              <ComingSoonImage alt="" />
            </button>
          </li>
        ))}
      </ul>

      {hasExtra && !expanded && (
        <button className="venue-gallery__more" type="button" onClick={() => setExpanded(true)}>
          Show all {photos.length} photos
        </button>
      )}

      <Lightbox items={photos.map((photo) => photo.label)} index={openIndex} onIndexChange={setOpenIndex} />
    </>
  );
}
