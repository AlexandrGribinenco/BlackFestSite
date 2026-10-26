"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { ComingSoonImage } from "../ComingSoonImage";

type Control = "reset" | "zoom" | "fullscreen";

type ZoomableMediaProps = {
  /** Alt text of the picture */
  label: string;
  controls: Control[];
  /** Corner for the control buttons */
  controlsAt?: "top" | "bottom";
  className?: string;
  /** Overlays shown above the picture */
  children?: ReactNode;
};

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const STEP = 0.5;

// Picture with zoom and fullscreen buttons: the 3D stage viewer and the event map (Figma: D4 stage and map).
// Until the 3D model and the AutoCAD plan arrive it zooms the placeholder artwork.
export function ZoomableMedia({ label, controls, controlsAt = "bottom", className, children }: ZoomableMediaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(MIN_SCALE);
  const [fullscreen, setFullscreen] = useState(false);
  // The Fullscreen API is missing on iPhone; the button is hidden there
  const [canFullscreen, setCanFullscreen] = useState(false);

  useEffect(() => {
    setCanFullscreen(document.fullscreenEnabled);
    const sync = () => setFullscreen(document.fullscreenElement === ref.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else ref.current?.requestFullscreen();
  }

  const zoomBy = (step: number) => setScale((s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s + step)));

  return (
    <div ref={ref} className={cx("placeholder zoomable", className)}>
      <div className="zoomable__media" style={{ transform: `scale(${scale})` }}>
        <ComingSoonImage alt={label} />
      </div>

      {children}

      <div className={`zoomable__controls zoomable__controls--${controlsAt}`}>
        {controls.includes("reset") && (
          <button className="zoomable__button zoomable__button--zoom" type="button" aria-label="Reset view" disabled={scale === MIN_SCALE} onClick={() => setScale(MIN_SCALE)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        )}
        {controls.includes("zoom") && (
          <>
            <button className="zoomable__button zoomable__button--zoom" type="button" aria-label="Zoom in" disabled={scale === MAX_SCALE} onClick={() => zoomBy(STEP)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <button className="zoomable__button zoomable__button--zoom" type="button" aria-label="Zoom out" disabled={scale === MIN_SCALE} onClick={() => zoomBy(-STEP)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M5 12h14" />
              </svg>
            </button>
          </>
        )}
        {controls.includes("fullscreen") && canFullscreen && (
          <button className="zoomable__button" type="button" aria-label={fullscreen ? "Exit full screen" : "Full screen"} onClick={toggleFullscreen}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {fullscreen ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
