import type { Metadata } from "next";
import Link from "next/link";
import { AdaptiveText } from "@/components/AdaptiveText";
import { BarMenu } from "@/components/bar/BarMenu";
import { MenuTagBadge } from "@/components/bar/MenuTagBadge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ComingSoonImage } from "@/components/ComingSoonImage";
import { MENU, MENU_LEGEND } from "@/lib/bar-menu";
import { pageMetadata } from "@/lib/site";
import "./bar.css";

// Figma: Desktop / D13 · Bar & Restaurant 347:5840, Mobile / M12 · Bar & Restaurant 179:778

export const metadata: Metadata = pageMetadata({
  title: "Bar & Restaurant — Black Out Fest 2027",
  description: "Street food, cocktails and a chill zone right next to the stage: opening hours, location and the menu of the View Bar at Black Out Fest 2027.",
  path: "/bar-restaurant",
});

// TODO: replace the placeholders with the real hours and location
const heroFacts = ["Open · [HOURS]", "Zone · [LOCATION]", "Card & cash"];

export default function BarRestaurantPage() {
  return (
    <main>
      <div className="container bar-top">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Bar & Restaurant" }]} />

        <section className="bar-hero" aria-labelledby="bar-title">
          <div className="placeholder bar-hero__photo">
            <ComingSoonImage alt="Bar and food area — photo coming soon" priority />
          </div>
          <div className="bar-hero__card">
            <p className="eyebrow eyebrow--accent">View Bar · On the festival grounds</p>
            <h1 className="bar-hero__title" id="bar-title">
              Bar &amp; Restaurant
            </h1>
            <p className="bar-hero__text">
              <AdaptiveText
                full="Street food, cocktails and a chill zone right next to the stage. Open every festival day — no need to leave the grounds."
                short="Street food, cocktails and a chill zone right next to the stage. Open every festival day."
              />
            </p>
            <ul className="chips bar-hero__facts">
              {heroFacts.map((fact) => (
                <li key={fact} className="chip chip--static">
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ul className="bar-facts">
          <li className="bar-fact">
            <p className="eyebrow">Opening hours</p>
            <p className="bar-fact__value">
              [DAY 1] · 12:00 – 02:00
              <br />
              [DAY 2] · 12:00 – 02:00
              <br />
              [DAY 3] · 12:00 – 00:00
            </p>
            <p className="bar-fact__note">Kitchen closes 1 h earlier</p>
          </li>
          <li className="bar-fact">
            <p className="eyebrow">Where to find us</p>
            <p className="bar-fact__value">[ZONE] — next to the main stage</p>
            <Link className="bar-fact__note" href="/gallery#event-map">
              See the festival map
            </Link>
          </li>
          <li className="bar-fact">
            <p className="eyebrow">Good to know</p>
            <p className="bar-fact__value">Card &amp; cash accepted · Alcohol 18+ (ID required) · Allergen info at the bar</p>
            <p className="bar-fact__note">Free drinking water point nearby</p>
          </li>
        </ul>
      </div>

      <section className="container bar-menu-section" aria-labelledby="menu-title">
        <div className="bar-menu-section__head">
          <div>
            <h2 className="section-title" id="menu-title">
              Menu
            </h2>
            <p className="bar-menu-section__intro">Prices in MDL. Menu may change during the festival.</p>
          </div>
          {/* TODO: link to the menu PDF */}
          <button className="btn btn-outline bar-menu-section__download" type="button">
            Download menu (PDF)
          </button>
        </div>

        <BarMenu categories={MENU} />

        <ul className="bar-legend" aria-label="Menu marks">
          {MENU_LEGEND.map(({ tag, text }) => (
            <li key={tag}>
              <MenuTagBadge tag={tag} />
              {text}
            </li>
          ))}
        </ul>
      </section>

      <section className="container bar-atmosphere" aria-labelledby="atmosphere-title">
        <h2 className="bar-atmosphere__title" id="atmosphere-title">
          Atmosphere
        </h2>
        <ul className="bar-atmosphere__photos">
          {[1, 2, 3].map((n) => (
            <li key={n} className="placeholder">
              <ComingSoonImage alt={`Bar photo ${n} — coming soon`} />
            </li>
          ))}
        </ul>
      </section>

      <div className="container">
        <aside className="bar-cta" aria-labelledby="bar-cta-title">
          <div>
            <h2 className="bar-cta__title" id="bar-cta-title">
              Entry to the bar is with a festival ticket
            </h2>
            <p className="bar-cta__text">Food and drinks are paid on site.</p>
          </div>
          <Link className="btn btn-primary" href="/tickets">
            Buy tickets
          </Link>
        </aside>
      </div>
    </main>
  );
}
