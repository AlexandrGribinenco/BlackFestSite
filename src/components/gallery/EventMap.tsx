"use client";

import { useState } from "react";
import { cx } from "@/lib/cx";
import { AdaptiveText } from "../AdaptiveText";
import { ZoomableMedia } from "./ZoomableMedia";

export type MapZone = {
  name: string;
  /** Shorter name used on mobile */
  short?: string;
};

// Event map with numbered zones (Figma: D4 "map" 347:2966, M5 "map" 3:10704).
// Picking a zone in the legend highlights it; the plan itself is still a placeholder.
export function EventMap({ zones }: { zones: MapZone[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="event-map">
      <h2 className="gallery-title event-map__title" id="event-map-title">
        Event map
      </h2>

      <ZoomableMedia className="event-map__plan" label="Event map — coming soon" controls={["zoom"]} controlsAt="top">
        {active !== null && (
          <p className="event-map__selected">
            <span className="event-map__number">{active + 1}</span>
            {zones[active].name}
          </p>
        )}
      </ZoomableMedia>

      <div className="event-map__side">
        <ol className="event-map__legend">
          {zones.map((zone, i) => (
            <li key={zone.name}>
              <button
                className={cx("event-map__zone", active === i && "is-active")}
                type="button"
                aria-pressed={active === i}
                onClick={() => setActive(active === i ? null : i)}
              >
                <span className="event-map__number" aria-hidden="true">
                  {i + 1}
                </span>
                <AdaptiveText full={zone.name} short={zone.short} />
              </button>
            </li>
          ))}
        </ol>
        {/* TODO: link to the event map PDF */}
        <button className="btn btn-outline event-map__download" type="button">
          Download map (PDF)
        </button>
      </div>
    </div>
  );
}
