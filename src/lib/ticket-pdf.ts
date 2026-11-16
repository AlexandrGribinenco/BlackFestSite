// PDF e-tickets: A4, one page per ticket (Figma: Desktop / D9 · E-mail + PDF ticket 347:1594, "2 · PDF e-ticket").
// Runs in the browser (Download PDF on the Done step) and on the server (attached to the confirmation e-mail).
// The text is set in Inter (public/fonts): the standard PDF fonts have no ș, ț or ă for the Romanian names.
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { create as createQr } from "qrcode";
import { COMPANY } from "./company";
import { EVENT } from "./event";
import type { ETicket } from "./tickets";

export type TicketFonts = { regular: ArrayBuffer | Uint8Array; bold: ArrayBuffer | Uint8Array };

type TicketsPdfInput = {
  tickets: ETicket[];
  /** Buyer's name, printed on every ticket */
  holder: string;
  orderNumber: string;
  /** Site address for the header and the footer, e.g. https://example.md */
  siteUrl: string;
  fonts: TicketFonts;
};

// A4 in points; the wireframe is drawn at the same size
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 40;

const INK = rgb(0.067, 0.067, 0.067);
const MUTED = rgb(0.42, 0.42, 0.42);
const RULE = rgb(0.85, 0.85, 0.85);

/** Code in the QR, unique per ticket. TODO: sign it on the server once the entrance has a scanner to check it */
export const ticketCode = (orderNumber: string, index: number) => `${orderNumber}-${String(index + 1).padStart(2, "0")}`;

export async function ticketsPdf({ tickets, holder, orderNumber, siteUrl, fonts }: TicketsPdfInput): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  // Whole fonts: pdf-lib drops glyphs when it subsets Inter
  const regular = await pdf.embedFont(fonts.regular);
  const bold = await pdf.embedFont(fonts.bold);

  pdf.setTitle(`${EVENT.name} — tickets, order ${orderNumber}`);
  pdf.setAuthor(COMPANY.legalName);
  pdf.setCreator(COMPANY.siteName);

  const website = siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "") || "[WEBSITE]";

  tickets.forEach((ticket, index) => {
    const page = pdf.addPage([PAGE_W, PAGE_H]);
    const draw = new PageWriter(page);

    // Header: logo and the organizer's details
    draw.box(MARGIN, 40, 96, 96, 1.5);
    draw.centered("LOGO", MARGIN + 48, 82, 10, bold, INK);
    [COMPANY.legalName, COMPANY.legalAddress, `${website} · ${COMPANY.email}`, COMPANY.phone].forEach((line, i) => {
      draw.text(line, 156, 44 + i * 16, 9.5, regular, MUTED, PAGE_W - MARGIN - 156);
    });
    draw.rule(156);

    // Title and the ticket details
    draw.text("ELECTRONIC TICKET", MARGIN, 182, 8.5, bold, INK);
    draw.text(EVENT.name, MARGIN, 198, 30, bold, INK);

    const rows: Array<[string, string]> = [
      ["Name", holder || "—"],
      ["Ticket", ticket.title],
      ...(ticket.seat ? [["Seat", ticket.seat] as [string, string]] : []),
      ["Date & time", `${EVENT.date} · ${EVENT.time}`],
      ["Venue", EVENT.address],
      ["Price", ticket.price],
      ["Order", `#${orderNumber}`],
    ];
    let top = 258;
    for (const [label, value] of rows) {
      draw.text(label, MARGIN, top, 10, regular, MUTED);
      top += draw.paragraph(value, 190, top, 10, bold, INK, PAGE_W - MARGIN - 190, 15) + 13;
    }

    // QR code and the ticket number
    const qrTop = Math.max(top + 12, 470);
    const code = ticketCode(orderNumber, index);
    draw.qr(code, MARGIN, qrTop, 170);
    draw.text(`Ticket № ${String(index + 1).padStart(4, "0")}`, 232, qrTop + 58, 16, bold, INK);
    draw.text("Show this code at the entrance.", 232, qrTop + 84, 9.5, regular, MUTED);
    draw.text("Valid for one entry only.", 232, qrTop + 99, 9.5, regular, MUTED);
    draw.text(code, 232, qrTop + 122, 8.5, regular, MUTED);

    // Footer
    draw.rule(764);
    draw.text(`All rights reserved · Terms at ${website}/legal/terms`, MARGIN, 776, 8, regular, MUTED);
    draw.right("Visa · Mastercard · American Express", PAGE_W - MARGIN, 776, 8, bold, INK);
  });

  return pdf.save();
}

// Draws from the top left, as the wireframe is measured; pdf-lib counts from the bottom left
class PageWriter {
  constructor(private readonly page: PDFPage) {}

  /** `top` is the top of the text line */
  text(value: string, x: number, top: number, size: number, font: PDFFont, color = INK, maxWidth?: number) {
    let line = value;
    if (maxWidth !== undefined) {
      while (line.length > 1 && font.widthOfTextAtSize(line, size) > maxWidth) line = line.slice(0, -2) + "…";
    }
    this.page.drawText(line, { x, y: PAGE_H - top - size * 0.8, size, font, color });
  }

  /** Wraps on spaces; returns the height used */
  paragraph(value: string, x: number, top: number, size: number, font: PDFFont, color: ReturnType<typeof rgb>, maxWidth: number, leading: number): number {
    const lines: string[] = [];
    for (const word of value.split(" ")) {
      const last = lines[lines.length - 1];
      if (last !== undefined && font.widthOfTextAtSize(`${last} ${word}`, size) <= maxWidth) lines[lines.length - 1] = `${last} ${word}`;
      else lines.push(word);
    }
    lines.forEach((line, i) => this.text(line, x, top + i * leading, size, font, color, maxWidth));
    return lines.length * leading;
  }

  centered(value: string, centerX: number, top: number, size: number, font: PDFFont, color = INK) {
    this.text(value, centerX - font.widthOfTextAtSize(value, size) / 2, top, size, font, color);
  }

  right(value: string, rightX: number, top: number, size: number, font: PDFFont, color = INK) {
    this.text(value, rightX - font.widthOfTextAtSize(value, size), top, size, font, color);
  }

  rule(top: number) {
    this.page.drawLine({ start: { x: MARGIN, y: PAGE_H - top }, end: { x: PAGE_W - MARGIN, y: PAGE_H - top }, thickness: 0.75, color: RULE });
  }

  box(x: number, top: number, width: number, height: number, thickness: number) {
    this.page.drawRectangle({ x, y: PAGE_H - top - height, width, height, borderColor: INK, borderWidth: thickness });
  }

  /** QR code drawn as vector squares, with the quiet zone inside the frame */
  qr(value: string, x: number, top: number, size: number) {
    const { modules } = createQr(value, { errorCorrectionLevel: "M" });
    const count = modules.size;
    const cell = size / (count + 8);
    const origin = { x: x + cell * 4, y: PAGE_H - top - cell * 4 };

    this.box(x, top, size, size, 1);
    for (let row = 0; row < count; row++) {
      let col = 0;
      while (col < count) {
        if (!modules.get(row, col)) {
          col++;
          continue;
        }
        // Dark squares in a row merge into one rectangle; the small overlap hides hairline gaps in viewers
        const start = col;
        while (col < count && modules.get(row, col)) col++;
        this.page.drawRectangle({
          x: origin.x + start * cell,
          y: origin.y - (row + 1) * cell - 0.05,
          width: (col - start) * cell + 0.05,
          height: cell + 0.1,
          color: INK,
        });
      }
    }
  }
}
