// PDF e-tickets for a paid order, attached to the confirmation e-mail.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ticketsPdf } from "@/lib/ticket-pdf";
import { ticketsFromItems } from "@/lib/tickets";
import type { Attachment } from "./email";
import type { PaymentInfo } from "./maib";

// The same files the browser loads; the hosting build copies public/ next to server.js (docs/deploy-hostmd.md)
let fonts: Promise<{ regular: Uint8Array; bold: Uint8Array }> | undefined;
const loadFonts = () =>
  (fonts ??= Promise.all([
    readFile(path.join(process.cwd(), "public/fonts/Inter-Regular.ttf")),
    readFile(path.join(process.cwd(), "public/fonts/Inter-Bold.ttf")),
  ]).then(([regular, bold]) => ({ regular, bold })));

/** null when the order has no tickets (nothing but the booking fee) */
export async function ticketsAttachment(payment: PaymentInfo): Promise<Attachment | null> {
  const tickets = ticketsFromItems(payment.items ?? []);
  if (tickets.length === 0) return null;

  const orderNumber = payment.orderId ?? payment.payId;
  const content = await ticketsPdf({
    tickets,
    holder: payment.clientName ?? "",
    orderNumber,
    siteUrl: process.env.SITE_URL ?? "",
    fonts: await loadFonts(),
  });
  return { filename: `black-out-fest-2027-tickets-${orderNumber}.pdf`, content, contentType: "application/pdf" };
}
