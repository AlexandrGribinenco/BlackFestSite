import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ComingSoonImage } from "@/components/ComingSoonImage";
import { FaqList, type FaqItem } from "@/components/FaqList";
import { SectionNav, type NavSection } from "@/components/SectionNav";
import { Skeleton } from "@/components/Skeleton";
import { EVENT } from "@/lib/event";
import "./info.css";

// Figma: Desktop / D5 · Info & FAQ 347:2389, Mobile / M6 · Info & FAQ 3:10899

export const metadata: Metadata = {
  title: "Info & FAQ — Black Out Fest 2027",
  description: "Getting there, parking, camping, bar & restaurant, entry rules and answers to common questions about Black Out Fest 2027.",
};

const sections: NavSection[] = [
  { id: "getting-there", label: "Getting there", short: "Get there" },
  { id: "parking", label: "Parking" },
  { id: "camping", label: "Camping" },
  { id: "bar-restaurant", label: "Bar & restaurant", short: "Bar" },
  { id: "entry-rules", label: "Entry rules", short: "Rules" },
  { id: "faq", label: "FAQ" },
  { id: "partners", label: "Partners & ads", short: "Partners" },
];

const faq: FaqItem[] = [
  { question: "When do doors open?" },
  { question: "Can I re-enter the venue?", short: "Can I re-enter?" },
  { question: "Is there a cloakroom?" },
  { question: "Can I pay by card at the bar?" },
  { question: "Is the venue accessible?" },
  { question: "What happens if the event is cancelled?", short: "What if it’s cancelled?" },
];

export default function InfoPage() {
  return (
    <main>
      <div className="container page-head">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Info" }]} />
        <h1 className="page-head__title">Info</h1>
        <p className="page-head__intro">Everything you need to know before you go.</p>
      </div>

      <div className="container info">
        <SectionNav sections={sections} label="Info sections" />

        <div className="info__content">
          <section className="info-section" id="getting-there" aria-labelledby="getting-there-title">
            <h2 className="info-section__title" id="getting-there-title">
              Getting there
            </h2>
            <div className="info-split">
              <div className="info-text">
                <p className="info-venue">{EVENT.venueName}</p>
                <p>{EVENT.address}</p>
                <Skeleton size="sm" widths={[undefined, "70%"]} />
                {/* TODO: link to the venue on the map */}
                <a className="btn btn-outline" href={EVENT.mapsUrl} target="_blank" rel="noopener noreferrer">
                  Open in Google Maps
                </a>
              </div>
              <div className="placeholder info-media">
                <ComingSoonImage alt="Map to the venue — coming soon" />
              </div>
            </div>
          </section>

          <section className="info-section" id="parking" aria-labelledby="parking-title">
            <h2 className="info-section__title" id="parking-title">
              Parking
            </h2>
            <div className="info-split">
              <div className="info-text">
                <Skeleton size="sm" widths={[undefined, undefined, "60%"]} />
                <p>
                  Parking pass: <strong>[PRICE]</strong> · buy with your ticket
                </p>
              </div>
              <div className="placeholder info-media info-media--short">
                <ComingSoonImage alt="Parking photo or scheme — coming soon" />
              </div>
            </div>
          </section>

          <section className="info-section" id="camping" aria-labelledby="camping-title">
            <h2 className="info-section__title" id="camping-title">
              Camping
            </h2>
            <div className="info-split info-split--media-first">
              <div className="placeholder info-media">
                <ComingSoonImage alt="Camping area — coming soon" />
              </div>
              <div className="info-text">
                <Skeleton size="sm" widths={[undefined, undefined, "65%"]} />
                <ul className="info-list">
                  <li>Check-in: [TIME]</li>
                  <li>Showers &amp; WC: [yes/no]</li>
                  <li>Bring your own tent / rent a tent</li>
                </ul>
                <Link className="btn btn-outline" href="/checkout">
                  Add camping to my ticket
                </Link>
              </div>
            </div>
          </section>

          <section className="info-section" id="bar-restaurant" aria-labelledby="bar-restaurant-title">
            <h2 className="info-section__title" id="bar-restaurant-title">
              Bar &amp; restaurant
            </h2>
            <div className="info-tiles">
              {["Bar", "Restaurant"].map((name) => (
                <Link key={name} className="info-tile" href="/bar-restaurant">
                  <div className="placeholder info-tile__media">
                    <ComingSoonImage alt="" />
                  </div>
                  <p className="info-tile__title">{name}</p>
                  <Skeleton size="sm" widths={["80%"]} />
                </Link>
              ))}
            </div>
          </section>

          <section className="info-section" id="entry-rules" aria-labelledby="entry-rules-title">
            <h2 className="info-section__title" id="entry-rules-title">
              Entry rules
            </h2>
            <div className="rule-cards">
              <div className="rule-card">
                <p className="rule-card__title">[AGE]+</p>
                <p className="rule-card__text">ID required at entrance</p>
              </div>
              <div className="rule-card">
                <p className="rule-card__title">Allowed</p>
                <Skeleton size="sm" widths={[undefined, "60%"]} />
              </div>
              <div className="rule-card">
                <p className="rule-card__title">Not allowed</p>
                <Skeleton size="sm" widths={[undefined, "60%"]} />
              </div>
            </div>
          </section>

          <section className="info-section" id="faq" aria-labelledby="faq-title">
            <h2 className="info-section__title" id="faq-title">
              FAQ
            </h2>
            <FaqList items={faq} />
          </section>

          <section className="info-section" id="partners" aria-labelledby="partners-title">
            <h2 className="info-section__title" id="partners-title">
              Partners &amp; advertising
            </h2>
            <div className="partner-card">
              <div className="info-text">
                <p className="partner-card__title">LED screens, brand zones, bar sponsorship</p>
                <Skeleton size="sm" widths={[undefined, "60%"]} />
                <Link className="btn btn-outline" href="/partners">
                  Become a partner
                </Link>
              </div>
              <div className="placeholder partner-card__media">
                <ComingSoonImage alt="LED screen photo — coming soon" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
