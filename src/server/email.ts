// Payment confirmation e-mail. maib requires it to show: order number, merchant name, website name, amount,
// currency, payment date and the order description (items and quantities).
// Sent over SMTP from a mailbox on the site's domain. host.md doesn't allow sending through outside mail servers or
// services, only through the hosting's own (mail.<domain>, port 465 or 587), at most 500 e-mails an hour per domain.
import nodemailer, { type Transporter } from "nodemailer";
import { COMPANY } from "@/lib/company";
import type { PaymentInfo } from "./maib";

type Email = { to: string; subject: string; text: string; html: string };

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

const money = (amount: number, currency: string) => `${amount.toFixed(2)} ${currency}`;

export function paymentConfirmationEmail(payment: PaymentInfo, paidAt: Date): Email | null {
  if (!payment.email) return null;

  const siteUrl = process.env.SITE_URL ?? "";
  const date = paidAt.toLocaleString("en-GB", { timeZone: "Europe/Chisinau", dateStyle: "long", timeStyle: "short" });
  const lines = (payment.items ?? []).map((item) => `${item.name} × ${item.quantity} — ${money(item.price * item.quantity, payment.currency)}`);
  const facts: Array<[string, string]> = [
    ["Order number", payment.orderId ?? payment.payId],
    ["Merchant", COMPANY.legalName],
    ["Website", siteUrl ? `${COMPANY.siteName} (${siteUrl})` : COMPANY.siteName],
    ["Amount", money(payment.amount, payment.currency)],
    ["Payment date", date],
    ["Card", payment.cardNumber ?? "—"],
  ];

  const subject = `${COMPANY.siteName}: payment confirmed, order ${payment.orderId ?? payment.payId}`;
  const text = [
    `Hello${payment.clientName ? `, ${payment.clientName}` : ""}!`,
    "",
    "Your payment was successful. Your e-tickets will follow in a separate e-mail.",
    "",
    ...facts.map(([label, value]) => `${label}: ${value}`),
    "",
    "Order:",
    ...lines,
    "",
    `Questions? Write to ${COMPANY.email} or call ${COMPANY.phone}.`,
    `${COMPANY.legalName}, IDNO ${COMPANY.idno}, ${COMPANY.legalAddress}`,
  ].join("\n");

  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#0b0714">
<h1 style="font-size:20px">Payment confirmed</h1>
<p>Hello${payment.clientName ? `, ${escapeHtml(payment.clientName)}` : ""}! Your payment was successful. Your e-tickets will follow in a separate e-mail.</p>
<table cellpadding="4" style="border-collapse:collapse">${facts
    .map(([label, value]) => `<tr><td style="color:#6b6380">${escapeHtml(label)}</td><td><strong>${escapeHtml(value)}</strong></td></tr>`)
    .join("")}</table>
<h2 style="font-size:16px">Order</h2>
<ul>${lines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
<p style="color:#6b6380;font-size:12px">Questions? Write to ${escapeHtml(COMPANY.email)} or call ${escapeHtml(COMPANY.phone)}.<br>
${escapeHtml(COMPANY.legalName)}, IDNO ${escapeHtml(COMPANY.idno)}, ${escapeHtml(COMPANY.legalAddress)}</p>
</body></html>`;

  return { to: payment.email, subject, text, html };
}

let transporter: Transporter | undefined;

export async function sendEmail(email: Email): Promise<void> {
  const { SMTP_HOST, SMTP_USER, SMTP_PASSWORD, EMAIL_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !EMAIL_FROM) {
    console.warn(`[email] SMTP_HOST / SMTP_USER / SMTP_PASSWORD / EMAIL_FROM not set, not sent: "${email.subject}" to ${email.to}`);
    return;
  }

  // 465 is SSL from the start, 587 switches to TLS with STARTTLS
  const port = Number(process.env.SMTP_PORT ?? 465);
  transporter ??= nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASSWORD } });
  await transporter.sendMail({ from: EMAIL_FROM, to: email.to, subject: email.subject, text: email.text, html: email.html });
}
