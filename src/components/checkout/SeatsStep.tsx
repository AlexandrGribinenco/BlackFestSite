"use client";

import { useState } from "react";
import {
  SEAT_CATEGORIES,
  SEAT_ROWS,
  SEATS_PER_SIDE,
  isSeatSold,
  seatId,
  seatsNeeded,
  seatsPicked,
  type Order,
  type SeatCategory,
} from "@/lib/checkout";
import { cx } from "@/lib/cx";

type SeatsStepProps = {
  order: Order;
  onToggleSeat: (id: string) => void;
  onBack: () => void;
};

// Step 2 (Figma: D3 "sec2" 2:828, M4.2 51:418)
export function SeatsStep({ order, onToggleSeat, onBack }: SeatsStepProps) {
  const needed = seatsNeeded(order);
  const [active, setActive] = useState<SeatCategory>(() => SEAT_CATEGORIES.find((c) => needed[c] > 0) ?? "A");
  const left = needed[active] - seatsPicked(order, active);

  const hint =
    left > 0
      ? `Pick ${left} ${left === 1 ? "seat" : "seats"} in Category ${active}. Click a seat to select it.`
      : `All seats in Category ${active} are picked. Click another seat to move your selection.`;

  return (
    <section aria-labelledby="checkout-step-title">
      <h1 className="checkout-title" id="checkout-step-title">
        <span className="only-desktop">Step 2. </span>Choose seats
      </h1>
      <p className="checkout-subtitle" aria-live="polite">
        {hint}
      </p>

      <div className="seat-tabs" role="tablist" aria-label="Seat category">
        {SEAT_CATEGORIES.map((category) => (
          <button
            key={category}
            className="seat-tab"
            type="button"
            role="tab"
            aria-selected={category === active}
            disabled={needed[category] === 0}
            onClick={() => setActive(category)}
          >
            Category {category}
          </button>
        ))}
      </div>

      <SeatMap category={active} selected={order.seats} onToggle={onToggleSeat} />

      <button className="btn btn-outline checkout-back" type="button" onClick={onBack}>
        Back
      </button>
    </section>
  );
}

type SeatMapProps = {
  category: SeatCategory;
  selected: string[];
  onToggle: (id: string) => void;
};

function SeatMap({ category, selected, onToggle }: SeatMapProps) {
  const sides = [
    Array.from({ length: SEATS_PER_SIDE }, (_, i) => i + 1),
    Array.from({ length: SEATS_PER_SIDE }, (_, i) => SEATS_PER_SIDE + i + 1),
  ];

  return (
    <div className="seat-map" role="tabpanel" aria-label={`Category ${category} seats`}>
      <div className="seat-map__scroll">
        <div className="seat-map__stage">Stage</div>
        {SEAT_ROWS.map((row, rowIndex) => (
          <div key={row} className="seat-row">
            <span className="seat-row__label" aria-hidden="true">
              {row}
            </span>
            {sides.map((numbers, side) => (
              <div key={side} className="seat-row__side">
                {numbers.map((number) => {
                  const id = seatId(category, row, number);
                  const sold = isSeatSold(category, rowIndex, number);
                  const isSelected = selected.includes(id);
                  return (
                    <button
                      key={id}
                      className={cx("seat", sold && "is-sold", isSelected && "is-selected")}
                      type="button"
                      disabled={sold}
                      aria-pressed={isSelected}
                      aria-label={`Row ${row}, seat ${number}${sold ? ", sold" : ""}`}
                      onClick={() => onToggle(id)}
                    />
                  );
                })}
              </div>
            ))}
            <span className="seat-row__label" aria-hidden="true">
              {row}
            </span>
          </div>
        ))}
      </div>

      <p className="seat-map__hint">Swipe to see all seats · tap a seat</p>

      <ul className="seat-key">
        <li>
          <span className="seat" aria-hidden="true" />
          Available
        </li>
        <li>
          <span className="seat is-selected" aria-hidden="true" />
          Selected
        </li>
        <li>
          <span className="seat is-sold" aria-hidden="true" />
          Sold
        </li>
      </ul>
    </div>
  );
}
