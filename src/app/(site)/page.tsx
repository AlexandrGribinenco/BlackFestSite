import Link from "next/link";
import { ComingSoonImage } from "@/components/ComingSoonImage";
import { Countdown } from "@/components/Countdown";
import { OrganizerCard, type OrganizerCardProps } from "@/components/OrganizerCard";
import { ProductCard, type ProductCardProps } from "@/components/ProductCard";
import { SectionHead } from "@/components/SectionHead";
import { Skeleton } from "@/components/Skeleton";
import { TicketCard, type TicketCardProps } from "@/components/TicketCard";
import { EVENT } from "@/lib/event";

// Figma: Desktop / D1 · Home 1:2, Mobile / M1 · Home 2:7604

const tickets: TicketCardProps[] = [
  { phase: "Early bird", title: "General Admission", price: "[PRICE]", status: "sold-out", href: "/tickets" },
  { phase: "Phase 1", title: "General Admission", price: "[PRICE]", status: "on-sale", href: "/tickets" },
  { phase: "Phase 1", title: "VIP", price: "[PRICE]", status: "on-sale", href: "/tickets" },
];

const products: ProductCardProps[] = [
  { title: "Framed print — [ARTWORK]", price: "[PRICE]", badge: "New" },
  { title: "Vinyl LP — [ARTIST / ALBUM]", price: "[PRICE]" },
  { title: "Poster — Line-up 2027 (A2)", price: "[PRICE]", badge: "Pre-order" },
  { title: "E-journal · issue #1 (PDF)", price: "[PRICE]" },
];

const experienceTiles = [
  { href: "/info#concept", label: "The concept" },
  { href: "/gallery", label: "Stage & sound" },
  { href: "/bar-restaurant", label: "Bar & restaurant" },
  { href: "/info#camping", label: "Camping & parking" },
];

// The second "Venue" tile is hidden on mobile, as in the M1 wireframe
const galleryTiles = [
  { label: "Venue" },
  { label: "Venue", desktopOnly: true },
  { label: "3D stage" },
  { label: "Sound" },
  { label: "Event map" },
];

const organizerCards: OrganizerCardProps[] = [
  { badge: "Coming soon", title: "Weekly events" },
  { badge: "At the festival", title: "Bar & Restaurant", link: { href: "/bar-restaurant", label: "Learn more" } },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="container hero__grid">
          <div className="placeholder hero__poster">
            <ComingSoonImage alt="Black Out Fest 2027 poster — coming soon" priority />
          </div>

          <div className="hero__content">
            <p className="eyebrow eyebrow--accent">Music, art &amp; culture festival</p>
            <h1 className="hero__title">
              Black Out
              <br />
              Fest 2027
            </h1>
            <p className="hero__meta">[DATE] · Doors [TIME] · [VENUE], [CITY]</p>

            <Skeleton className="hero__skeleton" widths={["88%", "71%", "49%"]} />

            <Countdown target={EVENT.start} />

            <div className="hero__actions">
              <Link className="btn btn-primary btn-lg btn-ring" href="/tickets">
                <span className="only-desktop">Buy tickets</span>
                <span className="only-mobile">Buy tickets · from [PRICE]</span>
              </Link>
              <Link className="btn btn-outline btn-lg" href="/info">
                Event info
              </Link>
              <p className="hero__price">
                From <strong>[PRICE]</strong>
                <br />
                The price you pay — no hidden fees
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tickets */}
      <section className="section section--band" aria-labelledby="tickets-title">
        <div className="container">
          <SectionHead
            eyebrow="Ticket releases"
            title="Tickets"
            titleId="tickets-title"
            action={
              <Link className="link-arrow" href="/tickets">
                All<span className="only-desktop"> ticket options</span> →
              </Link>
            }
          />

          <div className="tickets">
            {tickets.map((ticket, i) => (
              <TicketCard key={i} {...ticket} />
            ))}
          </div>
          <p className="swipe-hint only-mobile" aria-hidden="true">
            ← swipe →
          </p>
        </div>
      </section>

      {/* Official shop */}
      <section className="section" aria-labelledby="shop-title">
        <div className="container">
          <SectionHead
            eyebrow="Official shop"
            title="Art, vinyl & posters"
            titleId="shop-title"
            action={
              <Link className="link-arrow" href="/shop">
                Shop<span className="only-desktop"> all</span> →
              </Link>
            }
          />

          <div className="products">
            {products.map((product) => (
              <ProductCard key={product.title} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* The experience */}
      <section className="section section--flush-top" aria-labelledby="experience-title">
        <div className="container">
          <SectionHead eyebrow="The experience" title="More than a concert" titleId="experience-title" />

          <div className="experience">
            {experienceTiles.map((tile) => (
              <Link key={tile.label} className="experience__tile" href={tile.href}>
                <ComingSoonImage alt="" />
                <span className="experience__label">{tile.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery + promo video */}
      <section className="section section--flush-top" aria-labelledby="gallery-title">
        <div className="container">
          <SectionHead
            eyebrow="Venue · Stage · Sound"
            title="Gallery"
            titleId="gallery-title"
            action={
              <Link className="link-arrow" href="/gallery">
                Open<span className="only-desktop"> gallery</span> →
              </Link>
            }
          />

          <div className="gallery-strip">
            {galleryTiles.map((tile, i) => (
              <Link
                key={i}
                className={tile.desktopOnly ? "placeholder gallery-strip__item gallery-strip__item--desktop" : "placeholder gallery-strip__item"}
                href="/gallery"
              >
                <ComingSoonImage alt={`${tile.label} — photos coming soon`} />
              </Link>
            ))}
          </div>

          <div className="placeholder promo-video">
            <ComingSoonImage alt="Promo video — coming soon" />
            <span className="promo-video__play" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        </div>
      </section>

      {/* Partners & sponsors */}
      <section className="section section--divided" aria-labelledby="partners-title">
        <div className="container partners">
          <div className="partners__main">
            <SectionHead
              compact
              title="Partners & sponsors"
              titleId="partners-title"
              action={
                <Link className="link-arrow" href="/partners">
                  All partners →
                </Link>
              }
            />
            <ul className="partners__logos">
              {Array.from({ length: 6 }, (_, i) => (
                <li key={i} className="placeholder">
                  Logo
                </li>
              ))}
            </ul>
            <div className="dots only-desktop" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>

          <aside className="brands-card" aria-labelledby="brands-title">
            <p className="eyebrow">For brands</p>
            <h3 className="brands-card__title" id="brands-title">
              Advertise on our LED screens &amp; brand zones
            </h3>
            <Skeleton size="sm" className="only-desktop" widths={[undefined, "70%"]} />
            <Link className="btn btn-outline" href="/partners">
              Become a partner
            </Link>
          </aside>
        </div>
      </section>

      {/* By the organizer */}
      <section className="section section--band section--organizer" aria-labelledby="organizer-title">
        <div className="container">
          <SectionHead eyebrow="By the organizer" title="More from View Bar" titleId="organizer-title" />

          <div className="organizer">
            {organizerCards.map((card) => (
              <OrganizerCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
