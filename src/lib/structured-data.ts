// Structured data for search engines (schema.org JSON-LD): the festival as an event with its dates, venue and ticket
// prices, and the shop products with their prices. Google shows these as rich results. Nothing is output while the
// data are placeholders, so "[DATE]" never reaches a search engine.
import { CURRENCY, TICKET_TYPES } from "./checkout";
import { COMPANY } from "./company";
import { EVENT } from "./event";
import type { ShopProduct } from "./shop";
import { SITE_URL, absoluteUrl } from "./site";

const isPlaceholder = (value: string) => value.includes("[");

/** The festival as a MusicEvent; null until the date and the venue are filled in (lib/event.ts) */
export function festivalEventData(): Record<string, unknown> | null {
  if ([EVENT.date, EVENT.venueName, EVENT.address].some(isPlaceholder)) return null;

  const start = new Date(EVENT.start);
  const prices = TICKET_TYPES.filter((type) => !type.soldOut && type.amount !== null).map((type) => type.amount as number);
  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: EVENT.name,
    description: "Music, art & culture festival by View Bar.",
    startDate: EVENT.start,
    endDate: new Date(start.getTime() + EVENT.durationHours * 60 * 60 * 1000).toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: EVENT.venueName, address: EVENT.address },
    image: [absoluteUrl("/og.png")],
    organizer: { "@type": "Organization", name: COMPANY.brand, url: SITE_URL },
    ...(prices.length > 0 && {
      offers: {
        "@type": "AggregateOffer",
        url: absoluteUrl("/tickets"),
        priceCurrency: CURRENCY,
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        availability: "https://schema.org/InStock",
      },
    }),
  };
}

/** A shop product with its offer; null until its price is set. TODO: add the product photos once they exist */
export function productData(product: ShopProduct): Record<string, unknown> | null {
  if (product.amount === null || isPlaceholder(product.name)) return null;

  const availability = product.soldOut ? "OutOfStock" : product.badge === "Pre-order" ? "PreOrder" : "InStock";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    sku: product.id,
    brand: { "@type": "Brand", name: "Black Out Fest" },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/shop/${product.id}`),
      priceCurrency: CURRENCY,
      price: product.amount,
      availability: `https://schema.org/${availability}`,
      seller: { "@type": "Organization", name: COMPANY.legalName },
    },
  };
}
