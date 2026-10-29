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
import type { Checkout, CheckoutCallback } from "./maib";

/** An order line; it goes to maib as a checkout item and comes back with the paid order */
export type OrderItem = { id: string; name: string; price: number; quantity: number };

export type PricedOrder = { items: OrderItem[]; total: number };

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

  const items: OrderItem[] = [];
  // A seated ticket is one item per seat, id "<type>/<seat id>", so each paid item maps to e-tickets (lib/tickets.ts)
  const add = (id: string, name: string, amount: number | null, qty: unknown, seats: string[] = []) => {
    if (qty === undefined || qty === 0) return null;
    if (!Number.isInteger(qty) || (qty as number) < 0 || (qty as number) > MAX_PER_TYPE) return `Invalid quantity for ${name}`;
    if (amount === null) return `The price of ${name} is not set yet`;
    if (seats.length === 0) items.push({ id, name: name.slice(0, 128), price: amount, quantity: qty as number });
    for (const seat of seats) items.push({ id: `${id}/${seat}`, name: `${name} · ${formatSeats([seat])}`.slice(0, 128), price: amount, quantity: 1 });
    return null;
  };

  for (const [id, qty] of Object.entries(order.tickets)) {
    const type = TICKET_TYPES.find((t) => t.id === id);
    if (!type) return { error: `Unknown ticket type ${id}` };
    if (type.soldOut && qty > 0) return { error: `${type.name} is sold out` };
    const seats = type.seatCategory ? seatsOfCategory(order, type.seatCategory) : [];
    const error = add(type.id, type.name, type.amount, qty, seats);
    if (error) return { error };
  }

  for (const [id, qty] of Object.entries(order.addons)) {
    const addon = ADDONS.find((a) => a.id === id);
    if (!addon) return { error: `Unknown add-on ${id}` };
    const error = add(addon.id, addon.name, addon.amount, qty);
    if (error) return { error };
  }

  if (!items.some((item) => TICKET_TYPES.some((t) => t.id === item.id.split("/")[0]))) return { error: "The order has no tickets" };
  if (!order.seats.every((id) => SEAT_ID.test(id)) || !seatsComplete(order)) return { error: "Pick a seat for every seated ticket" };
  // TODO: check on the ticketing backend that the seats are still free and held for this buyer

  if (BOOKING_FEE_AMOUNT > 0) items.push({ id: "fee", name: "Booking fee", price: BOOKING_FEE_AMOUNT, quantity: 1 });

  const total = round(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
  if (total < 1) return { error: "The order total must be at least 1" };
  return { items, total };
}

/** A paid order as maib returns it (checkout details and the callback): what the e-mail and the e-tickets are made of */
export type PaidOrder = {
  orderId: string;
  checkoutId: string;
  paymentId: string;
  amount: number;
  currency: string;
  paidAt: Date;
  items: OrderItem[];
  buyerName: string;
  buyerEmail: string | null;
  /** Masked card number; only the callback has it */
  cardNumber: string | null;
};

export function paidOrder(checkout: Checkout, callback?: CheckoutCallback): PaidOrder {
  return {
    orderId: checkout.order?.id ?? callback?.orderId ?? checkout.id,
    checkoutId: checkout.id,
    paymentId: checkout.payment?.paymentId ?? callback?.paymentId ?? "",
    amount: checkout.payment?.amount ?? checkout.amount,
    currency: checkout.payment?.currency ?? checkout.currency,
    paidAt: new Date(checkout.payment?.executedAt ?? callback?.paymentExecutedAt ?? checkout.completedAt ?? Date.now()),
    items: (checkout.order?.orderItems ?? []).map((item) => ({
      id: item.externalId ?? "",
      name: item.title ?? "",
      price: item.amount ?? 0,
      quantity: item.quantity ?? 1,
    })),
    buyerName: checkout.payer?.name ?? callback?.payerName ?? "",
    buyerEmail: checkout.payer?.email ?? callback?.payerEmail ?? null,
    cardNumber: callback?.senderCardNumber ?? null,
  };
}

/** Order number shown to the buyer and sent to maib (up to 36 characters), e.g. BOF-M2X7K9-4F1A */
export function newOrderId(): string {
  return `BOF-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`;
}
