// Prices the checkout order on the server, so the amount charged never comes from the browser.
import { randomBytes } from "node:crypto";
import {
  ADDONS,
  BOOKING_FEE_AMOUNT,
  MAX_PER_TYPE,
  SEAT_CATEGORIES,
  TICKET_TYPES,
  formatSeats,
  seatsComplete,
  seatsOfCategory,
  type Order,
} from "@/lib/checkout";
import type { MaibItem } from "./maib";

export type PricedOrder = { items: MaibItem[]; total: number };

const round = (value: number) => Math.round(value * 100) / 100;

const SEAT_ID = new RegExp(`^[${SEAT_CATEGORIES.join("")}]-[A-Z]-\\d{1,2}$`);

function quantities(value: unknown): Record<string, number> {
  return value && typeof value === "object" ? (value as Record<string, number>) : {};
}

/** Validates the order sent by the browser and prices it from the catalog; returns an error message on bad input */
export function priceOrder(input: unknown): PricedOrder | { error: string } {
  const raw = (input ?? {}) as Partial<Order>;
  const order: Order = {
    tickets: quantities(raw.tickets),
    addons: quantities(raw.addons),
    seats: Array.isArray(raw.seats) ? raw.seats.filter((s): s is string => typeof s === "string") : [],
  };

  const items: MaibItem[] = [];
  const add = (id: string, name: string, amount: number | null, qty: unknown) => {
    if (qty === undefined || qty === 0) return null;
    if (!Number.isInteger(qty) || (qty as number) < 0 || (qty as number) > MAX_PER_TYPE) return `Invalid quantity for ${name}`;
    if (amount === null) return `The price of ${name} is not set yet`;
    items.push({ id, name: name.slice(0, 128), price: amount, quantity: qty as number });
    return null;
  };

  for (const [id, qty] of Object.entries(order.tickets)) {
    const type = TICKET_TYPES.find((t) => t.id === id);
    if (!type) return { error: `Unknown ticket type ${id}` };
    if (type.soldOut && qty > 0) return { error: `${type.name} is sold out` };
    const seats = type.seatCategory ? formatSeats(seatsOfCategory(order, type.seatCategory)) : "";
    const error = add(type.id, seats ? `${type.name} · ${seats}` : type.name, type.amount, qty);
    if (error) return { error };
  }

  for (const [id, qty] of Object.entries(order.addons)) {
    const addon = ADDONS.find((a) => a.id === id);
    if (!addon) return { error: `Unknown add-on ${id}` };
    const error = add(addon.id, addon.name, addon.amount, qty);
    if (error) return { error };
  }

  if (!items.some((item) => TICKET_TYPES.some((t) => t.id === item.id))) return { error: "The order has no tickets" };
  if (!order.seats.every((id) => SEAT_ID.test(id)) || !seatsComplete(order)) return { error: "Pick a seat for every seated ticket" };
  // TODO: check on the ticketing backend that the seats are still free and held for this buyer

  if (BOOKING_FEE_AMOUNT > 0) items.push({ id: "fee", name: "Booking fee", price: BOOKING_FEE_AMOUNT, quantity: 1 });

  const total = round(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
  if (total < 1) return { error: "The order total must be at least 1" };
  return { items, total };
}

/** Order number shown to the buyer and sent to maib (up to 36 characters), e.g. BOF-M2X7K9-4F1A */
export function newOrderId(): string {
  return `BOF-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`;
}
