// Checkout data and order rules (Figma: Desktop / D3 · Checkout 2:518, Mobile / M4.1–M4.5)
// Ticket types and prices: the client's list of 30.10.2026, in euro. None of them is seated, so the seat step,
// the seat hold timer and the venue plan stay hidden; the seat map code is kept for a seated event.
// TODO: what each ticket includes (the features below follow the names), and the add-ons if there are any.

export type CheckoutStep = "tickets" | "seats" | "details" | "payment" | "done";

export const CHECKOUT_STEPS: Array<{ id: CheckoutStep; label: string }> = [
  { id: "tickets", label: "Tickets" },
  { id: "seats", label: "Seats" },
  { id: "details", label: "Details" },
  { id: "payment", label: "Payment" },
  { id: "done", label: "Done" },
];

export type SeatCategory = "A" | "B" | "C";

export type TicketType = {
  id: string;
  name: string;
  description: string;
  /** Shorter description used on mobile */
  shortDescription: string;
  price: string;
  /** Price as a number in CURRENCY, used to charge the card; null until the real prices are set */
  amount: number | null;
  /** Short label above or under the price */
  phase: string;
  /** What the ticket includes, on the Tickets page cards */
  features: string[];
  soldOut?: boolean;
  /** Seated tickets are placed on the seat map in step 2 */
  seatCategory?: SeatCategory;
};

/** Currency of prices and card payments; maib accepts MDL, EUR and USD */
export const CURRENCY = "EUR";

const priced = (amount: number) => ({ amount, price: formatMoney(amount) });

export const TICKET_TYPES: TicketType[] = [
  {
    id: "early-bird",
    name: "Early Bird",
    description: "Festival entry at the early price",
    shortDescription: "Festival entry · early price",
    ...priced(165),
    phase: "Early price",
    features: ["Festival entry", "Early price, while it lasts"],
  },
  {
    id: "door",
    name: "Door Ticket",
    description: "Festival entry at the standard price",
    shortDescription: "Festival entry",
    ...priced(185),
    phase: "Standard",
    features: ["Festival entry", "Standard price"],
  },
  {
    id: "backstage",
    name: "Backstage",
    description: "Festival entry and backstage access",
    shortDescription: "Entry + backstage",
    ...priced(215),
    phase: "Backstage",
    features: ["Festival entry", "Backstage access"],
  },
  {
    id: "press",
    name: "Press",
    description: "Festival entry for media, with press area access",
    shortDescription: "Entry for media",
    ...priced(250),
    phase: "Media",
    features: ["Festival entry", "Press area access"],
  },
  {
    id: "vip",
    name: "VIP",
    description: "Festival entry and the VIP zone",
    shortDescription: "Entry + VIP zone",
    ...priced(350),
    phase: "Premium",
    features: ["Festival entry", "VIP zone"],
  },
];

/** False while no ticket type is seated: no seat step, seat hold or venue plan */
export const HAS_SEATS = TICKET_TYPES.some((type) => type.seatCategory);

/** The lowest ticket price, for "from …" labels */
export const LOWEST_PRICE = formatMoney(Math.min(...TICKET_TYPES.filter((type) => !type.soldOut && type.amount !== null).map((type) => type.amount as number)));

export type Addon = {
  id: string;
  name: string;
  description: string;
  price: string;
  /** Price as a number in CURRENCY; null until the real prices are set */
  amount: number | null;
};

// The wireframe's camping spot and parking pass are not in the client's list: no add-ons until the client asks for them
export const ADDONS: Addon[] = [];

export const SEAT_CATEGORIES: SeatCategory[] = ["A", "B", "C"];
export const SEAT_ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
export const SEATS_PER_SIDE = 9;
export const MAX_PER_TYPE = 10;
/** How long seats are held while the buyer completes the order */
export const HOLD_SECONDS = 10 * 60;

/** Outcome of the simulated payment; switch to "failure" to see the D8 "Payment failed" state */
// TODO: remove once the payment provider is connected
export const SIMULATED_PAYMENT_RESULT: "success" | "failure" = "success";

/** Booking fee per order in CURRENCY; 0 hides the fee line (the price shown is the price paid) */
export const BOOKING_FEE_AMOUNT = 0;

/** Amount in CURRENCY, or the placeholder while the price is not set */
export function formatMoney(amount: number | null, placeholder = "[PRICE]"): string {
  if (amount === null) return placeholder;
  return `${amount.toLocaleString("en", { maximumFractionDigits: 2 })} ${CURRENCY}`;
}

/** The order total in CURRENCY, as the server charges it (server/orders.ts); null while a chosen item has no price */
export function orderTotal(order: Order): number | null {
  const lines = [
    ...TICKET_TYPES.map((type) => ({ amount: type.amount, qty: order.tickets[type.id] ?? 0 })),
    ...ADDONS.map((addon) => ({ amount: addon.amount, qty: order.addons[addon.id] ?? 0 })),
  ];
  let total = 0;
  for (const { amount, qty } of lines) {
    if (qty === 0) continue;
    if (amount === null) return null;
    total += amount * qty;
  }
  if (total > 0) total += BOOKING_FEE_AMOUNT;
  return Math.round(total * 100) / 100;
}

export type Order = {
  tickets: Record<string, number>;
  addons: Record<string, number>;
  /** Seat ids, see seatId() */
  seats: string[];
};

export const EMPTY_ORDER: Order = { tickets: {}, addons: {}, seats: [] };

export function seatId(category: SeatCategory, row: string, number: number): string {
  return `${category}-${row}-${number}`;
}

function parseSeatId(id: string) {
  const [category, row, number] = id.split("-");
  return { category: category as SeatCategory, row, number: Number(number) };
}

// Placeholder occupancy so the wireframe map looks realistic
export function isSeatSold(category: SeatCategory, rowIndex: number, number: number): boolean {
  return (rowIndex * 7 + number * 5 + category.charCodeAt(0)) % 6 === 0;
}

export function ticketCount(order: Order): number {
  return Object.values(order.tickets).reduce((sum, qty) => sum + qty, 0);
}

/** Seats to pick per category, from the seated tickets in the order */
export function seatsNeeded(order: Order): Record<SeatCategory, number> {
  const needed: Record<SeatCategory, number> = { A: 0, B: 0, C: 0 };
  for (const type of TICKET_TYPES) {
    if (type.seatCategory) needed[type.seatCategory] += order.tickets[type.id] ?? 0;
  }
  return needed;
}

export function needsSeats(order: Order): boolean {
  return Object.values(seatsNeeded(order)).some((n) => n > 0);
}

export function seatsPicked(order: Order, category: SeatCategory): number {
  return order.seats.filter((id) => parseSeatId(id).category === category).length;
}

export function seatsComplete(order: Order): boolean {
  const needed = seatsNeeded(order);
  return SEAT_CATEGORIES.every((cat) => seatsPicked(order, cat) === needed[cat]);
}

/** "Row E · Seats 11, 12", several rows joined with "; " */
export function formatSeats(ids: string[]): string {
  const byRow = new Map<string, number[]>();
  for (const id of ids) {
    const { category, row, number } = parseSeatId(id);
    const key = `${category}-${row}`;
    byRow.set(key, [...(byRow.get(key) ?? []), number]);
  }
  return [...byRow.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, numbers]) => {
      const row = key.split("-")[1];
      const sorted = numbers.sort((a, b) => a - b);
      return `Row ${row} · ${sorted.length > 1 ? "Seats" : "Seat"} ${sorted.join(", ")}`;
    })
    .join("; ");
}

/** Seats of one category, for the order summary line under that ticket type */
export function seatsOfCategory(order: Order, category: SeatCategory): string[] {
  return order.seats.filter((id) => parseSeatId(id).category === category);
}
