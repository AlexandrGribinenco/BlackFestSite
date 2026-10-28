// Where the site lives and whether search engines may index it. Both are read at build time, as the pages are
// prerendered: the GitHub Pages workflow gives the test site's address and keeps it out of search; the hosting
// workflow takes both as inputs (site_url, search_engines). Locally: localhost, not indexed.
import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

/** Off until the launch, so the placeholders don't end up in search results */
export const INDEXABLE = process.env.NEXT_PUBLIC_INDEXABLE === "1";

export const SITE_NAME = "Black Out Fest 2027";

/** Share preview for every page (app/og.png/route.tsx) */
export const OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: "Black Out Fest 2027 — music, art & culture festival" };

/** Absolute address of a page, e.g. for structured data */
export const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

type PageMetadataInput = {
  title: string;
  description: string;
  /** Page path without the base path, e.g. "/tickets" */
  path: string;
};

/** Title, description, canonical address and the share preview (Open Graph, X) of a page */
export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US", title, description, url: path, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
}
