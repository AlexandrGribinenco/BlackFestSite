import type { ReactNode } from "react";
import { ComingSoonImage } from "@/components/ComingSoonImage";
import { ADDONS, BOOKING_FEE, ORDER_TOTAL, TICKET_TYPES, formatSeats, seatsOfCategory, type Order } from "@/lib/checkout";
import { EVENT } from "@/lib/event";

// Figma: Components / Order summary 1:751
export function OrderSummary({ order, cta }: { order: Order; cta: ReactNode }) {
  return (
    <aside className="order-summary" aria-labelledby="order-summary-title">
      <h2 className="order-summary__title" id="order-summary-title">
        Your order
      </h2>

      <div className="order-summary__event">
        <div className="placeholder order-summary__poster">
          <ComingSoonImage alt="" />
        </div>
        <div>
          <p className="order-summary__event-name">{EVENT.name}</p>
          <p className="order-summary__event-meta">
            {EVENT.date} · {EVENT.time}
            <br />
            {EVENT.venue}
          </p>
        </div>
      </div>

      <OrderLines order={order} />

      <p className="order-summary__total">
        <span>Total</span>
        <span>{ORDER_TOTAL}</span>
      </p>

      {cta}

      <p className="order-summary__secure">
        <span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          Secure payment
        </span>
        <span>VISA · MC · AMEX</span>
      </p>
    </aside>
  );
}

export function OrderLines({ order }: { order: Order }) {
  const tickets = TICKET_TYPES.filter((type) => (order.tickets[type.id] ?? 0) > 0);
  const addons = ADDONS.filter((addon) => (order.addons[addon.id] ?? 0) > 0);

  if (tickets.length === 0 && addons.length === 0) {
    return <p className="order-lines order-lines--empty">No tickets selected yet.</p>;
  }

  return (
    <ul className="order-lines">
      {tickets.map((type) => {
        const seats = type.seatCategory ? formatSeats(seatsOfCategory(order, type.seatCategory)) : "";
        return (
          <li key={type.id}>
            <span>
              {type.name} × {order.tickets[type.id]}
              {seats && <small>{seats}</small>}
            </span>
            <strong>{type.price}</strong>
          </li>
        );
      })}
      {addons.map((addon) => (
        <li key={addon.id}>
          <span>
            {addon.name} × {order.addons[addon.id]}
          </span>
          <strong>{addon.price}</strong>
        </li>
      ))}
      <li className="order-lines__fee">
        <span>Booking fee</span>
        <span>{BOOKING_FEE}</span>
      </li>
    </ul>
  );
}
