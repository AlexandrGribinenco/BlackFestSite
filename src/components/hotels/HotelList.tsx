"use client";

import { useState } from "react";
import { cx } from "@/lib/cx";
import { HOTEL_TYPE_LABELS, type Hotel, type HotelType } from "@/lib/hotels";
import { HotelCard } from "./HotelCard";

type Filter = HotelType | "all";
type Sort = "distance" | "stars";

const FILTERS: Filter[] = ["all", "hotel", "guesthouse", "apartments"];

const SORTERS: Record<Sort, { label: string; compare: (a: Hotel, b: Hotel) => number }> = {
  distance: { label: "Distance to festival", compare: (a, b) => a.distanceKm - b.distanceKm },
  // Places without stars (guesthouses, apartments) go last
  stars: { label: "Stars", compare: (a, b) => (b.stars ?? 0) - (a.stars ?? 0) || a.distanceKm - b.distanceKm },
};

// Hotel filters, sorting and the list (Figma: D15 "Filters" 347:6595 and "Grid · Hotels" 347:6613)
export function HotelList({ hotels }: { hotels: Hotel[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("distance");

  const shown = hotels.filter((h) => filter === "all" || h.type === filter).sort(SORTERS[sort].compare);

  return (
    <div className="hotel-list">
      <div className="hotel-toolbar">
        <div role="group" aria-label="Type of stay">
          <ul className="chips chips--scroll">
            {FILTERS.map((f) => (
              <li key={f}>
                <button className={cx("chip", filter === f && "is-active")} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                  {f === "all" ? "All" : HOTEL_TYPE_LABELS[f].many}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <label className="hotel-sort">
          <span className="hotel-sort__label">Sort</span>
          <select className="hotel-sort__select" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            {(Object.keys(SORTERS) as Sort[]).map((key) => (
              <option key={key} value={key}>
                {SORTERS[key].label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="hotel-count" aria-live="polite">
        {shown.length} {shown.length === 1 ? "hotel" : "hotels"}
      </p>

      <ul className="hotel-grid">
        {shown.map((hotel) => (
          <li key={hotel.name}>
            <HotelCard hotel={hotel} />
          </li>
        ))}
      </ul>
    </div>
  );
}
