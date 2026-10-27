"use client";

import { useEffect, useRef, type KeyboardEvent, type MouseEvent } from "react";
import { ComingSoonImage } from "../ComingSoonImage";
import "./lightbox.css";

type LightboxProps = {
  /** Photo captions, in viewing order */
  items: string[];
  /** Open photo, or null when the lightbox is closed */
  index: number | null;
  onIndexChange: (index: number | null) => void;
};

// Fullscreen photo viewer with arrows and a counter (Figma: D4 note under the venue photos)
export function Lightbox({ items, index, onIndexChange }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  if (items.length === 0) return null;

  const go = (step: number) => {
    if (index !== null) onIndexChange((index + step + items.length) % items.length);
  };

  function handleKeyDown(e: KeyboardEvent<HTMLDialogElement>) {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  }

  function closeOnBackdrop(e: MouseEvent<HTMLDialogElement>) {
    if (e.target === e.currentTarget) e.currentTarget.close();
  }

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label="Photo viewer"
      onClose={() => onIndexChange(null)}
      onKeyDown={handleKeyDown}
      onClick={closeOnBackdrop}
    >
      {index !== null && (
        <>
          <div className="lightbox__top">
            <p className="lightbox__counter" aria-live="polite">
              {index + 1} / {items.length}
            </p>
            <button className="lightbox__button" type="button" aria-label="Close" onClick={() => onIndexChange(null)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <figure className="lightbox__figure">
            <div className="placeholder lightbox__photo">
              <ComingSoonImage alt={`${items[index]} — photo coming soon`} priority />
            </div>
            <figcaption className="lightbox__caption">{items[index]}</figcaption>
          </figure>

          <button className="lightbox__button lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous photo" onClick={() => go(-1)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button className="lightbox__button lightbox__nav lightbox__nav--next" type="button" aria-label="Next photo" onClick={() => go(1)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </>
      )}
    </dialog>
  );
}
