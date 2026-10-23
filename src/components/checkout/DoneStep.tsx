"use client";

import Link from "next/link";
import { TICKET_TYPES, formatSeats, seatsOfCategory, type Order } from "@/lib/checkout";
import { EVENT } from "@/lib/event";

type DoneStepProps = {
  order: Order;
  email: string;
  orderNumber: string;
};

// Step 5 (Figma: D3 "Section · Payment successful!" 2:1822, M4.5 51:574)
export function DoneStep({ order, email, orderNumber }: DoneStepProps) {
  const ticketLines = TICKET_TYPES.filter((type) => (order.tickets[type.id] ?? 0) > 0).map((type) => {
    const seats = type.seatCategory ? formatSeats(seatsOfCategory(order, type.seatCategory)) : "";
    return seats ? `${type.name} · ${seats}` : `${type.name} × ${order.tickets[type.id]}`;
  });

  return (
    <section className="done" aria-labelledby="checkout-step-title">
      <div className="done__icon" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>
      <h1 className="done__title" id="checkout-step-title">
        Payment successful!
      </h1>
      <p className="done__text">
        Tickets sent to <strong>{email}</strong> · Order #{orderNumber}
      </p>

      <article className="done-ticket" aria-label="Your ticket">
        {/* TODO: real QR code from the ticketing backend */}
        <div className="placeholder done-ticket__qr">QR code</div>
        <div className="done-ticket__info">
          <p className="done-ticket__event">{EVENT.name}</p>
          <p>
            {EVENT.date} · {EVENT.time} · {EVENT.venue}
          </p>
          {ticketLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="done-ticket__note">Show this QR code at the entrance</p>
        </div>
      </article>

      <div className="done__actions">
        {/* TODO: link to the PDF ticket; until then the browser's print dialog can save the ticket as PDF */}
        <button className="btn btn-primary btn-ring" type="button" onClick={() => window.print()}>
          Download PDF
        </button>
        <button className="btn btn-outline" type="button" onClick={() => downloadCalendarFile(orderNumber)}>
          Add to calendar
        </button>
      </div>

      <p className="done__help">
        No email? Check your spam folder or <Link href="/contacts">contact us</Link>
      </p>
    </section>
  );
}

const toIcsDate = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

function downloadCalendarFile(orderNumber: string) {
  const start = new Date(EVENT.start);
  const end = new Date(start.getTime() + EVENT.durationHours * 60 * 60 * 1000);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Black Out Fest//Tickets//EN",
    "BEGIN:VEVENT",
    `UID:order-${orderNumber}@blackoutfest`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${EVENT.name}`,
    `LOCATION:${EVENT.venue}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "black-out-fest-2027.ics";
  link.click();
  URL.revokeObjectURL(url);
}
