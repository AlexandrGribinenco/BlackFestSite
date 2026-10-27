// E-tickets (Figma: Desktop / D9 · E-mail + PDF ticket 347:1594): one per admission — one per seat for seated
// tickets — and one per add-on (camping spot, parking pass), each on its own PDF page (lib/ticket-pdf.ts).
import { ADDONS, TICKET_TYPES, formatMoney, formatSeats, seatsOfCategory, type Order } from "./checkout";

export type ETicket = {
  /** Ticket type or add-on, e.g. "Category A" */
  title: string;
  /** "Row E · Seat 11" for a seated ticket */
  seat?: string;
  price: string;
};

/** From the order in the browser (the Done step of the ticket checkout) */
export function ticketsFromOrder(order: Order): ETicket[] {
  const tickets: ETicket[] = [];
  for (const type of TICKET_TYPES) {
    const seats = type.seatCategory ? seatsOfCategory(order, type.seatCategory) : [];
    const price = type.amount === null ? type.price : formatMoney(type.amount);
    for (let i = 0; i < (order.tickets[type.id] ?? 0); i++) {
      tickets.push({ title: type.name, seat: seats[i] ? formatSeats([seats[i]]) : undefined, price });
    }
  }
  for (const addon of ADDONS) {
    const price = addon.amount === null ? addon.price : formatMoney(addon.amount);
    for (let i = 0; i < (order.addons[addon.id] ?? 0); i++) tickets.push({ title: addon.name, price });
  }
  return tickets;
}

type PaidItem = { id: string; name: string; price: number; quantity: number };

/**
 * From the paid items maib returns (the server, after the payment). Seated tickets come one item per seat, with the
 * id "<ticket type>/<seat id>" (server/orders.ts); the booking fee is not a ticket.
 */
export function ticketsFromItems(items: PaidItem[]): ETicket[] {
  return items.flatMap((item) => {
    const [id, seatId] = item.id.split("/");
    const title = TICKET_TYPES.find((t) => t.id === id)?.name ?? ADDONS.find((a) => a.id === id)?.name;
    if (!title) return [];
    const seat = seatId ? formatSeats([seatId]) : undefined;
    return Array.from({ length: item.quantity }, () => ({ title, seat, price: formatMoney(item.price) }));
  });
}
