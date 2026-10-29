// Payment confirmation e-mail with the PDF e-tickets attached (Figma: Desktop / D9 · E-mail + PDF ticket 347:1594,
// "1 · E-mail after payment"). maib requires it to show: order number, merchant name, website name, amount,
// currency, payment date and the order description (items and quantities).
// Sent over SMTP from a mailbox on the site's domain. host.md doesn't allow sending through outside mail servers or
// services, only through the hosting's own (mail.<domain>, port 465 or 587), at most 500 e-mails an hour per domain.
import nodemailer, { type Transporter } from "nodemailer";
import { COMPANY } from "@/lib/company";
import { EVENT } from "@/lib/event";
import type { PaidOrder } from "./orders";

export type Attachment = { filename: string; content: Uint8Array; contentType: string };

type Email = { to: string; subject: string; text: string; html: string; attachments?: Attachment[] };

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

const money = (amount: number, currency: string) => `${amount.toFixed(2)} ${currency}`;

/** `tickets` is the PDF with the e-tickets; without it the e-mail says they follow separately */
export function paymentConfirmationEmail(order: PaidOrder, tickets?: Attachment): Email | null {
  if (!order.buyerEmail) return null;

  const siteUrl = (process.env.SITE_URL ?? "").replace(/\/$/, "");
  const orderNumber = order.orderId;
  const date = order.paidAt.toLocaleString("en-GB", { timeZone: "Europe/Chisinau", dateStyle: "long", timeStyle: "short" });
  const items = order.items.map((item) => `${item.name}${item.quantity > 1 ? ` × ${item.quantity}` : ""}`);
  const facts: Array<[string, string]> = [
    ["Order", `#${orderNumber}`],
    ["Date & time", `${EVENT.date} · ${EVENT.time}`],
    ["Venue", `${EVENT.venue}, ${EVENT.address}`],
    ["Tickets", items.join("; ") || "—"],
    ["Total paid", money(order.amount, order.currency)],
    ["Payment date", date],
    ["Card", order.cardNumber ?? "—"],
    ["Merchant", COMPANY.legalName],
    ["Website", siteUrl ? `${COMPANY.siteName} (${siteUrl})` : COMPANY.siteName],
  ];
  const attached = tickets ? "Your e-tickets are attached as PDF." : "Your e-tickets will follow in a separate e-mail.";
  const entry = "Show the QR code at the entrance from your phone or printed. One QR = one entry.";
  const links: Array<[string, string]> = [
    ["Terms & Conditions", `${siteUrl}/legal/terms`],
    ["Privacy Policy", `${siteUrl}/legal/privacy`],
    ["Contact us", `${siteUrl}/contacts`],
  ];
  const legal = `${COMPANY.legalName} · IDNO ${COMPANY.idno} · ${COMPANY.legalAddress}`;

  const subject = `Your tickets for ${EVENT.name} — order ${orderNumber}`;
  const text = [
    `Dear ${order.buyerName || "guest"},`,
    `thank you for your order. ${attached}`,
    "",
    ...facts.map(([label, value]) => `${label}: ${value}`),
    "",
    entry,
    "",
    "Sincerely,",
    `Alexandru, ${COMPANY.siteName}`,
    "",
    `Questions? Write to ${COMPANY.email} or call ${COMPANY.phone}.`,
    legal,
  ].join("\n");

  // Table layout and inline styles: what mail apps render reliably
  const html = `<!doctype html><html><body style="margin:0;padding:24px 0;background:#f2f2f2;font-family:Arial,Helvetica,sans-serif;color:#111">
<table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#fff;border-collapse:collapse">
<tr><td align="center" style="padding:20px;background:#111"><span style="display:inline-block;padding:8px 22px;border:1.5px solid #fff;color:#fff;font-size:13px;font-weight:700;letter-spacing:1px">LOGO</span></td></tr>
<tr><td style="padding:32px 32px 8px">
<h1 style="margin:0 0 16px;font-size:24px;line-height:1.25">Your tickets for ${escapeHtml(EVENT.name)}</h1>
<p style="margin:0 0 20px;font-size:14px;line-height:1.5">Dear ${escapeHtml(order.buyerName || "guest")},<br>thank you for your order. ${attached}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:13px">${facts
    .map(
      ([label, value]) =>
        `<tr><td style="padding:9px 12px 9px 0;border-top:1px solid #e5e5e5;color:#6b6b6b;width:130px;vertical-align:top">${escapeHtml(label)}</td><td style="padding:9px 0;border-top:1px solid #e5e5e5;font-weight:700">${escapeHtml(value)}</td></tr>`,
    )
    .join("")}</table>
<p style="margin:20px 0 0;color:#6b6b6b;font-size:12px;line-height:1.5">${entry}</p>
<p style="margin:20px 0 24px;font-size:14px;line-height:1.5">Sincerely,<br>Alexandru, ${escapeHtml(COMPANY.siteName)}</p>
</td></tr>
<tr><td style="padding:16px 32px;background:#f7f7f7;color:#6b6b6b;font-size:11px;line-height:1.6">${escapeHtml(legal)}<br>${links
    .map(([label, href]) => (siteUrl ? `<a href="${escapeHtml(href)}" style="color:#6b6b6b">${escapeHtml(label)}</a>` : escapeHtml(label)))
    .join(" · ")}<br>Questions? ${escapeHtml(COMPANY.email)} · ${escapeHtml(COMPANY.phone)}</td></tr>
</table>
</body></html>`;

  return { to: order.buyerEmail, subject, text, html, attachments: tickets ? [tickets] : undefined };
}

let transporter: Transporter | undefined;

function smtp(): Transporter | null {
  const { SMTP_HOST, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) return null;
  // 465 is SSL from the start, 587 switches to TLS with STARTTLS
  const port = Number(process.env.SMTP_PORT ?? 465);
  transporter ??= nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASSWORD } });
  return transporter;
}

export async function sendEmail(email: Email): Promise<void> {
  const from = process.env.EMAIL_FROM;
  const transport = smtp();
  if (!transport || !from) {
    console.warn(`[email] SMTP_HOST / SMTP_USER / SMTP_PASSWORD / EMAIL_FROM not set, not sent: "${email.subject}" to ${email.to}`);
    return;
  }
  await transport.sendMail({
    from,
    to: email.to,
    subject: email.subject,
    text: email.text,
    html: email.html,
    attachments: email.attachments?.map((a) => ({ filename: a.filename, content: Buffer.from(a.content), contentType: a.contentType })),
  });
}

/** Connects and logs in to the mail server without sending anything (for /api/health) */
export async function verifySmtp(): Promise<void> {
  const transport = smtp();
  if (!transport) throw new Error("SMTP_HOST / SMTP_USER / SMTP_PASSWORD not set");
  await transport.verify();
}
