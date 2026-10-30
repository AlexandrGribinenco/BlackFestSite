import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { AdaptiveText } from "@/components/AdaptiveText";
import { AddonCard, type AddonCardProps } from "@/components/AddonCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ComingSoonImage } from "@/components/ComingSoonImage";
import { FaqList, type FaqItem } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { SectionHead } from "@/components/SectionHead";
import { TicketOptionCard, type TicketOptionCardProps } from "@/components/TicketOptionCard";
import { ADDONS, HAS_SEATS, LOWEST_PRICE, TICKET_TYPES } from "@/lib/checkout";
import { EVENT } from "@/lib/event";
import { pageMetadata } from "@/lib/site";
import { festivalEventData } from "@/lib/structured-data";
import "./tickets.css";

// Figma: Desktop / D2 · Tickets 2:2, Mobile / M3 · Tickets 3:9151. The client's ticket list (lib/checkout.ts) has no
// release phases and no seats, so the Figma phase card, the "Ticket releases" row and the seat part of the venue plan
// are left out; the ticket cards and the add-ons come from the checkout data.

export const metadata: Metadata = pageMetadata({
  title: "Tickets — Black Out Fest 2027",
  description: `Tickets and prices for Black Out Fest 2027, ${EVENT.date}, ${EVENT.venue}. The price you see is the price you pay.`,
  path: "/tickets",
});

const CHECKOUT_HREF = "/checkout";

const eventFacts = [
  { label: "Date", value: EVENT.date },
  { label: "Starts", value: EVENT.time },
  { label: "Venue", value: EVENT.address },
  { label: "Age", value: "[AGE]+ · ID required" },
];

const ticketOptions: TicketOptionCardProps[] = TICKET_TYPES.map((type) => ({
  category: type.phase,
  title: type.name,
  price: type.price,
  features: type.features,
  summary: type.shortDescription,
  href: CHECKOUT_HREF,
}));

const addons: AddonCardProps[] = ADDONS.map((addon) => ({
  title: addon.name,
  description: addon.description,
  shortDescription: addon.description,
  price: addon.price,
}));

const steps = [
  { title: "Choose & pay online", text: "Card payment, no account needed.", shortText: "No account needed" },
  { title: "Get your e-ticket by email", shortTitle: "Get e-ticket by email", text: "PDF ticket with a QR code.", shortText: "PDF with QR code" },
  { title: "Show the QR at the entrance", shortTitle: "Show QR at entrance", text: "From your phone or printed.", shortText: "Phone or print" },
];

const faq: FaqItem[] = [
  { question: "Can I get a refund?" },
  { question: "Can I transfer my ticket to someone else?", short: "Can I transfer my ticket?" },
  { question: "I did not receive my ticket email", short: "I did not receive my email" },
  { question: "Is there an age limit?" },
  { question: "Which payment methods do you accept?", short: "Payment methods" },
];

export default function TicketsPage() {
  return (
    <main className="tickets-page">
      <JsonLd data={festivalEventData()} />
      {/* Page hero */}
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tickets" }]} />

          <div className="page-hero__grid">
            <div className="placeholder page-hero__poster">
              <ComingSoonImage alt="Black Out Fest 2027 poster — coming soon" priority />
            </div>

            <div>
              <h1 className="page-hero__title">Tickets</h1>
              <p className="page-hero__subtitle">Black Out Fest 2027</p>
              <p className="page-hero__meta">
                {EVENT.date} · {EVENT.time} · {EVENT.venue} · [AGE]+
              </p>

              <dl className="event-facts">
                {eventFacts.map((fact) => (
                  <Fragment key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </Fragment>
                ))}
              </dl>

              <div className="release-banner">
                <div>
                  <p className="eyebrow eyebrow--accent">On sale now</p>
                  <p className="release-banner__title">Tickets from {LOWEST_PRICE}</p>
                  <p className="release-banner__text">Price includes all fees.</p>
                </div>
                <Link className="btn btn-primary btn-ring" href={CHECKOUT_HREF}>
                  Buy tickets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Choose your ticket + add-ons */}
      <section className="section ticket-options-section" aria-labelledby="options-title">
        <div className="container">
          <SectionHead
            title="Choose your ticket"
            titleId="options-title"
            action={<p className="section-head__note">The price you see is the price you pay.</p>}
          />
          <div className="ticket-options">
            {ticketOptions.map((option) => (
              <TicketOptionCard key={option.title} {...option} />
            ))}
          </div>

          {addons.length > 0 && (
            <>
              <h3 className="addons-title">Add-ons</h3>
              <div className="addons">
                {addons.map((addon) => (
                  <AddonCard key={addon.title} {...addon} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Where to stay */}
      <div className="container">
        <aside className="stay-banner" aria-labelledby="stay-title">
          <div>
            <p className="eyebrow eyebrow--accent">Where to stay</p>
            <h2 className="stay-banner__title" id="stay-title">
              Coming from another city? Book a hotel near the festival
            </h2>
            <p className="stay-banner__text">
              Partner hotels 1–5 km from the venue — some with discounts for festival guests. Booking on the hotel’s website.
            </p>
          </div>
          <Link className="btn btn-primary" href="/hotels">
            See hotels
          </Link>
        </aside>
      </div>

      {/* Venue plan with the seat legend, only for a seated event */}
      {HAS_SEATS && (
        <section className="section venue" aria-labelledby="venue-title">
          <div className="container">
            <h2 className="section-title venue__title" id="venue-title">
              Venue plan
            </h2>
            <div className="venue__grid">
              <div>
                <div className="placeholder venue__plan">
                  <ComingSoonImage alt="Venue plan and seating chart — coming soon" />
                </div>
                <p className="venue__note">You pick exact seats at checkout.</p>
              </div>

              <div className="venue__side">
                <h2 className="section-title">Pick your seat</h2>
                <p className="venue__side-text">You choose exact seats on the next step. Seats are held for 10 minutes while you pay.</p>
                <ul className="seat-legend">
                  <li>
                    <span className="seat-legend__swatch seat-legend__swatch--available" aria-hidden="true" />
                    Available
                  </li>
                  <li>
                    <span className="seat-legend__swatch seat-legend__swatch--selected" aria-hidden="true" />
                    Selected
                  </li>
                  <li>
                    <span className="seat-legend__swatch seat-legend__swatch--sold" aria-hidden="true" />
                    Sold
                  </li>
                </ul>
                <Link className="btn btn-primary btn-ring" href={CHECKOUT_HREF}>
                  Choose seats
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="section section--band how-section" aria-labelledby="how-title">
        <div className="container">
          <SectionHead title="How it works" titleId="how-title" />
          <ol className="steps">
            {steps.map((step, i) => (
              <li key={step.title} className="step">
                <span className="step__number" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <p className="step__title">
                    <AdaptiveText full={step.title} short={step.shortTitle} />
                  </p>
                  <p className="step__text">
                    <AdaptiveText full={step.text} short={step.shortText} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq-section" aria-labelledby="faq-title">
        <div className="container faq__grid">
          <div className="faq__intro">
            <h2 className="section-title" id="faq-title">
              Ticket FAQ
            </h2>
            <p>
              More answers on the <Link href="/info">Info page</Link>.
            </p>
          </div>

          <FaqList items={faq} />
        </div>
      </section>
    </main>
  );
}
