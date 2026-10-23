import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { AdaptiveText } from "@/components/AdaptiveText";
import { AddonCard, type AddonCardProps } from "@/components/AddonCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PhaseCard } from "@/components/PhaseCard";
import { ReleaseCard, type ReleaseCardProps } from "@/components/ReleaseCard";
import { SectionHead } from "@/components/SectionHead";
import { Skeleton } from "@/components/Skeleton";
import { TicketOptionCard, type TicketOptionCardProps } from "@/components/TicketOptionCard";
import "./tickets.css";

// Figma: Desktop / D2 · Tickets 2:2, Mobile / M3 · Tickets 3:9151

export const metadata: Metadata = {
  title: "Tickets — Black Out Fest 2027",
  description: "Ticket releases, prices and seating for Black Out Fest 2027. The price you see is the price you pay.",
};

// TODO: replace with the real date of the next price step
const PRICE_STEP_AT = "2027-02-01T12:00:00+02:00";

// TODO: link to the checkout once it exists (Figma: D3 · Checkout)
const CHECKOUT_HREF = "/checkout";

const eventFacts = [
  { label: "Date", value: "[DATE]" },
  { label: "Doors open", value: "[TIME]" },
  { label: "Venue", value: "[VENUE], [ADDRESS]" },
  { label: "Age", value: "[AGE]+ · ID required" },
];

const releases: ReleaseCardProps[] = [
  { title: "Early Bird", status: "sold-out", meta: "Launch: [DATE], 12:00", price: "[PRICE]", mobileNote: "sold out" },
  { title: "Phase 1", status: "on-sale", meta: "Launch: [DATE], 12:00", price: "[PRICE]", mobileNote: "on sale", current: true },
  { title: "Phase 2", status: "coming-soon", meta: "Starts after Phase 1 sells out", price: "[PRICE]", mobileNote: "after Phase 1" },
];

const ticketOptions: TicketOptionCardProps[] = [
  {
    category: "Standing",
    title: "General Admission",
    price: "[PRICE]",
    features: ["Access to all festival days", "Main stage area", "Bar & food court"],
    summary: "Standing · all festival days",
    href: CHECKOUT_HREF,
  },
  {
    category: "Seated",
    title: "Category A / B / C",
    price: "[PRICE]",
    features: ["Reserved seat", "Choose on seat map", "Dedicated entrance"],
    summary: "Reserved seat · choose on seat map",
    href: CHECKOUT_HREF,
  },
  {
    category: "Premium",
    title: "VIP / Table",
    price: "[PRICE]",
    features: ["VIP zone with own bar", "Table for up to [N] guests", "Fast-track entry"],
    summary: "VIP zone, own bar, fast-track entry",
    href: CHECKOUT_HREF,
  },
];

const addons: AddonCardProps[] = [
  { title: "Camping spot", description: "Tent place for the festival nights", shortDescription: "All nights", price: "[PRICE]" },
  { title: "Parking pass", description: "One car, all festival days", shortDescription: "One car", price: "[PRICE]" },
];

const steps = [
  { title: "Choose & pay online", text: "Card payment, no account needed.", shortText: "No account needed" },
  { title: "Get your e-ticket by email", shortTitle: "Get e-ticket by email", text: "PDF ticket with a QR code.", shortText: "PDF with QR code" },
  { title: "Show the QR at the entrance", shortTitle: "Show QR at entrance", text: "From your phone or printed.", shortText: "Phone or print" },
];

const faq = [
  { question: "Can I get a refund?" },
  { question: "Can I transfer my ticket to someone else?", short: "Can I transfer my ticket?" },
  { question: "I did not receive my ticket email", short: "I did not receive my email" },
  { question: "Is there an age limit?" },
  { question: "Which payment methods do you accept?", short: "Payment methods" },
];

export default function TicketsPage() {
  return (
    <main className="tickets-page">
      {/* Page hero */}
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tickets" }]} />

          <div className="page-hero__grid">
            <div className="placeholder page-hero__poster">Festival poster</div>

            <div>
              <h1 className="page-hero__title">Tickets</h1>
              <p className="page-hero__subtitle">Black Out Fest 2027</p>
              <p className="page-hero__meta">[DATE] · Doors [TIME] · [VENUE] · [AGE]+</p>

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
                  <p className="eyebrow eyebrow--accent">Current release</p>
                  <p className="release-banner__title">Phase 1 — from [PRICE]</p>
                  <p className="release-banner__text">Price includes all fees. Next price step in 12 days or when sold out.</p>
                </div>
                <Link className="btn btn-primary btn-ring" href={CHECKOUT_HREF}>
                  Buy tickets
                </Link>
              </div>

              <PhaseCard phase="Phase 1" price="[PRICE]" soldPercent={68} priceStepAt={PRICE_STEP_AT} href={CHECKOUT_HREF} />
            </div>
          </div>
        </div>
      </section>

      {/* Ticket releases */}
      <section className="section section--band releases-section" aria-labelledby="releases-title">
        <div className="container">
          <SectionHead title="Ticket releases" titleId="releases-title" />
          <div className="releases">
            {releases.map((release) => (
              <ReleaseCard key={release.title} {...release} />
            ))}
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

          <h3 className="addons-title">Add-ons</h3>
          <div className="addons">
            {addons.map((addon) => (
              <AddonCard key={addon.title} {...addon} />
            ))}
          </div>
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
            See hotels →
          </Link>
        </aside>
      </div>

      {/* Venue plan */}
      <section className="section venue" aria-labelledby="venue-title">
        <div className="container">
          <h2 className="section-title venue__title" id="venue-title">
            Venue plan
          </h2>
          <div className="venue__grid">
            <div>
              <div className="placeholder venue__plan">
                <span className="venue__plan-title">
                  <AdaptiveText full="Venue plan / seating chart" short="Seating chart (pinch to zoom)" />
                </span>
                <span className="venue__plan-text">Stage · zones A / B / C · VIP tables · bar</span>
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

          {/* TODO: real answers; the wireframe shows grey placeholder lines */}
          <div className="faq__list">
            {faq.map((item) => (
              <div key={item.question} className="faq__item">
                <h3 className="faq__question">
                  <AdaptiveText full={item.question} short={item.short} />
                </h3>
                <Skeleton size="sm" widths={[undefined, "70%"]} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
