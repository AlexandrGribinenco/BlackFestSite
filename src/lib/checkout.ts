// Checkout data and order rules (Figma: Desktop / D3 · Checkout 2:518, Mobile / M4.1–M4.5)
// Prices are wireframe placeholders; replace them and the seat data with the ticketing backend.

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
  phase: string;
  soldOut?: boolean;
  /** Seated tickets are placed on the seat map in step 2 */
  seatCategory?: SeatCategory;
};

export const TICKET_TYPES: TicketType[] = [
  { id: "ga", name: "General Admission", description: "Standing, all festival days", shortDescription: "Standing · Early Bird", price: "[PRICE]", amount: null, phase: "Early Bird", soldOut: true },
  { id: "cat-a", name: "Category A", description: "Reserved seat, closest to stage", shortDescription: "Reserved seat · Phase 1", price: "[PRICE]", amount: null, phase: "Phase 1", seatCategory: "A" },
  { id: "cat-b", name: "Category B", description: "Reserved seat", shortDescription: "Reserved seat · Phase 1", price: "[PRICE]", amount: null, phase: "Phase 1", seatCategory: "B" },
  { id: "cat-c", name: "Category C", description: "Reserved seat, back rows", shortDescription: "Reserved seat · Phase 1", price: "[PRICE]", amount: null, phase: "Phase 1", seatCategory: "C" },
  { id: "vip", name: "VIP / Table", description: "VIP zone, table for up to [N]", shortDescription: "VIP zone · Phase 1", price: "[PRICE]", amount: null, phase: "Phase 1" },
];

export type Addon = {
  id: string;
  name: string;
  description: string;
  price: string;
  /** Price as a number in CURRENCY; null until the real prices are set */
  amount: number | null;
};

export const ADDONS: Addon[] = [
  { id: "camping", name: "Camping spot", description: "Tent place, all nights", price: "[PRICE]", amount: null },
  { id: "parking", name: "Parking pass", description: "One car, all festival days", price: "[PRICE]", amount: null },
];

export const SEAT_CATEGORIES: SeatCategory[] = ["A", "B", "C"];
export const SEAT_ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
export const SEATS_PER_SIDE = 9;
export const MAX_PER_TYPE = 10;
/** How long seats are held while the buyer completes the order */
export const HOLD_SECONDS = 10 * 60;

/** Outcome of the simulated payment; switch to "failure" to see the D8 "Payment failed" state */
// TODO: remove once the payment provider is connected
export const SIMULATED_PAYMENT_RESULT: "success" | "failure" = "success";

export const BOOKING_FEE = "[FEE]";
/** Booking fee per order in CURRENCY. TODO: the real fee, or remove the fee line */
export const BOOKING_FEE_AMOUNT = 0;
/** Currency of prices and card payments; maib accepts MDL, EUR and USD */
export const CURRENCY = "MDL";
export const ORDER_TOTAL = "[TOTAL]";

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
