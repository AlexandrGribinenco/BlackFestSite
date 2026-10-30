import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PartnerTile } from "@/components/PartnerTile";
import { COMPANY } from "@/lib/company";
import { SPONSORS } from "@/lib/partners";
import { pageMetadata } from "@/lib/site";
import "./partners.css";

// Figma: Desktop / D14 · Partners 347:6222, Mobile / M13 · Partners 179:2145. Instead of the wireframe's general
// partner, partners and media partners there is one Sponsors group with the client's two sponsors (lib/partners.ts).

export const metadata: Metadata = pageMetadata({
  title: "Partners — Black Out Fest 2027",
  description: "The sponsors of Black Out Fest 2027 and how to become a partner of the festival.",
  path: "/partners",
});

export default function PartnersPage() {
  return (
    <main>
      <div className="container page-head">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Partners" }]} />
        <p className="eyebrow eyebrow--accent">Our partners</p>
        <h1 className="page-head__title">Partners</h1>
        <p className="page-head__intro partners-intro">
          Black Out Fest is made possible by the brands, venues and media who support music, art and culture in Moldova.
        </p>
      </div>

      <div className="container">
        <section className="partner-group" aria-labelledby="sponsors-title">
          <h2 className="partner-group__title" id="sponsors-title">
            Sponsors
          </h2>
          <ul className="partner-grid partner-grid--sponsors">
            {SPONSORS.map((partner) => (
              <li key={partner.name}>
                <PartnerTile partner={partner} featured />
              </li>
            ))}
          </ul>
        </section>

        <section className="hotel-partners" aria-labelledby="hotel-partners-title">
          <div>
            <h2 className="hotel-partners__title" id="hotel-partners-title">
              Hotel partners
            </h2>
            <p className="hotel-partners__text">Stay near the festival — booking on the hotel’s website.</p>
          </div>
          <Link className="btn btn-outline" href="/hotels">
            See hotels
          </Link>
        </section>

        <aside className="become-partner" aria-labelledby="become-partner-title">
          <div>
            <h2 className="become-partner__title" id="become-partner-title">
              Become a partner
            </h2>
            <p className="become-partner__text">
              Sponsorship, bar &amp; food, media and hotel partnerships. Write to <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> or
              download the partner deck.
            </p>
          </div>
          <div className="become-partner__actions">
            <Link className="btn btn-primary" href="/contacts">
              Contact us
            </Link>
            {/* TODO: link to the partner deck PDF */}
            <button className="btn btn-outline" type="button">
              Partner deck (PDF)
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
