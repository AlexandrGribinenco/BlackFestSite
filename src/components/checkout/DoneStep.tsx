"use client";

import Link from "next/link";
import { useState } from "react";
import { TICKET_TYPES, formatSeats, seatsOfCategory, type Order } from "@/lib/checkout";
import { EVENT } from "@/lib/event";
import { ticketsFromOrder } from "@/lib/tickets";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type DoneStepProps = {
  order: Order;
  email: string;
  /** Buyer's name, printed on the tickets */
  holder: string;
  orderNumber: string;
};

// Step 5 (Figma: D3 "Section · Payment successful!" 2:1822, M4.5 51:574)
export function DoneStep({ order, email, holder, orderNumber }: DoneStepProps) {
  const [pdfState, setPdfState] = useState<"idle" | "making" | "failed">("idle");

  async function downloadPdf() {
    setPdfState("making");
    try {
      await downloadTicketsPdf(order, holder, orderNumber);
      setPdfState("idle");
    } catch (error) {
      console.error("[tickets] PDF failed", error);
      setPdfState("failed");
    }
  }

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
        <button className="btn btn-primary btn-ring" type="button" disabled={pdfState === "making"} onClick={downloadPdf}>
          {pdfState === "making" ? "Preparing PDF…" : "Download PDF"}
        </button>
        <button className="btn btn-outline" type="button" onClick={() => downloadCalendarFile(orderNumber)}>
          Add to calendar
        </button>
      </div>

      {pdfState === "failed" && (
        <p className="pay-error" role="alert">
          The PDF couldn’t be made. Your tickets are also in the confirmation e-mail.
        </p>
      )}

      <p className="done__help">
        No email? Check your spam folder or <Link href="/contacts">contact us</Link>
      </p>
    </section>
  );
}

// The PDF library and the fonts load only when the buyer asks for the PDF (lib/ticket-pdf.ts, Figma: D9)
async function downloadTicketsPdf(order: Order, holder: string, orderNumber: string) {
  const [{ ticketsPdf }, regular, bold] = await Promise.all([
    import("@/lib/ticket-pdf"),
    fetch(`${BASE_PATH}/fonts/Inter-Regular.ttf`).then((r) => r.arrayBuffer()),
    fetch(`${BASE_PATH}/fonts/Inter-Bold.ttf`).then((r) => r.arrayBuffer()),
  ]);
  const bytes = await ticketsPdf({
    tickets: ticketsFromOrder(order),
    holder,
    orderNumber,
    siteUrl: `${window.location.origin}${BASE_PATH}`,
    fonts: { regular, bold },
  });

  const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `black-out-fest-2027-tickets-${orderNumber}.pdf`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
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
