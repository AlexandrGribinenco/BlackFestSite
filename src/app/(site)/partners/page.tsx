import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PartnerTile, type Partner } from "@/components/PartnerTile";
import { pageMetadata } from "@/lib/site";
import "./partners.css";

// Figma: Desktop / D14 · Partners 347:6222, Mobile / M13 · Partners 179:2145

export const metadata: Metadata = pageMetadata({
  title: "Partners — Black Out Fest 2027",
  description: "The brands, venues and media who make Black Out Fest 2027 possible, and how to become a partner of the festival.",
  path: "/partners",
});

// TODO: replace the placeholders with the real partners and their websites
const generalPartner: Partner = {
  name: "[PARTNER NAME]",
  description: "Short description of the partner and how it supports the festival — 1–2 lines.",
  url: "#",
};

const partners: Partner[] = Array.from({ length: 4 }, () => ({ name: "[PARTNER NAME]", category: "[CATEGORY]", url: "#" }));
const mediaPartners: Partner[] = Array.from({ length: 6 }, () => ({ name: "[PARTNER NAME]", category: "[CATEGORY]", url: "#" }));

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
        <section className="partner-group" aria-labelledby="general-partner-title">
          <h2 className="partner-group__title" id="general-partner-title">
            General partner
          </h2>
          <PartnerTile {...generalPartner} featured />
        </section>

        <section className="partner-group" aria-labelledby="partners-title">
          <h2 className="partner-group__title" id="partners-title">
            Partners
          </h2>
          <ul className="partner-grid">
            {partners.map((partner, i) => (
              <li key={i}>
                <PartnerTile {...partner} />
              </li>
            ))}
          </ul>
        </section>

        <section className="partner-group" aria-labelledby="media-partners-title">
          <h2 className="partner-group__title" id="media-partners-title">
            Media partners
          </h2>
          <ul className="partner-grid partner-grid--media">
            {mediaPartners.map((partner, i) => (
              <li key={i}>
                <PartnerTile {...partner} />
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
            {/* TODO: real partnership e-mail */}
            <p className="become-partner__text">
              Sponsorship, bar &amp; food, media and hotel partnerships. Write to partners@[domain] or download the partner deck.
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
