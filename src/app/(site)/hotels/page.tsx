import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ComingSoonImage } from "@/components/ComingSoonImage";
import { HotelList } from "@/components/hotels/HotelList";
import { COMPANY } from "@/lib/company";
import { HOTELS } from "@/lib/hotels";
import { pageMetadata } from "@/lib/site";
import "./hotels.css";

// Figma: Desktop / D15 · Hotels 347:6446, Mobile / M14 · Hotels 179:3281

export const metadata: Metadata = pageMetadata({
  title: "Hotels — Black Out Fest 2027",
  description: "Partner hotels near Black Out Fest 2027: compare distance, price and amenities and book directly on the hotel’s website.",
  path: "/hotels",
});

const steps = [
  { title: "Choose a hotel", text: "Compare distance, price and amenities." },
  { title: "Book on the hotel’s website", text: "The “Book” button opens the hotel’s site in a new tab." },
  { title: "Mention the festival", text: "Some partners offer a discount for festival guests." },
];

export default function HotelsPage() {
  return (
    <main>
      <div className="container page-head">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Hotels" }]} />
        <p className="eyebrow eyebrow--accent">Where to stay</p>
        <h1 className="page-head__title">Hotels</h1>
        <p className="page-head__intro hotels-intro">
          Partner hotels near the festival. Choose a hotel and book directly on its website — booking, payment and cancellation are handled by
          the hotel.
        </p>
      </div>

      <div className="container">
        <ol className="hotel-steps" aria-label="How it works">
          {steps.map((step, i) => (
            <li key={step.title} className="hotel-step">
              <span className="hotel-step__number" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <p className="hotel-step__title">{step.title}</p>
                <p className="hotel-step__text">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <HotelList hotels={HOTELS} />

        <section className="hotel-map-section" aria-labelledby="hotel-map-title">
          <h2 className="hotel-map-section__title" id="hotel-map-title">
            On the map
          </h2>
          {/* TODO: map with the festival venue and the partner hotels */}
          <div className="placeholder hotel-map">
            <ComingSoonImage alt="Map of the festival venue and partner hotels — coming soon" />
          </div>
        </section>

        <aside className="hotel-note" aria-labelledby="hotel-note-title">
          <div>
            <h2 className="hotel-note__title" id="hotel-note-title">
              Own a hotel near the festival?
            </h2>
            <p className="hotel-note__text">
              Black Out Fest is not responsible for bookings made on partner websites. Want to join the list? Write to{" "}
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
            </p>
          </div>
          <Link className="btn btn-outline" href="/partners">
            Become a partner
          </Link>
        </aside>
      </div>
    </main>
  );
}
