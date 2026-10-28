import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { CookieConsent } from "@/components/CookieConsent";
import { FormMessages } from "@/components/FormMessages";
import { INDEXABLE, OG_IMAGE, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

// Defaults for every page; each page sets its own title, description and address with pageMetadata() (lib/site.ts).
// Relative addresses in the metadata resolve against the site address.
export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: "Black Out Fest 2027 — Music, art & culture festival",
  description: "Black Out Fest 2027 — music, art & culture festival by View Bar. Tickets, line-up, gallery and official shop.",
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US", images: [OG_IMAGE] },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
  robots: INDEXABLE ? undefined : { index: false, follow: false },
  // Full addresses, so they work under the base path too (public/icon.svg, app/apple-icon.png/route.tsx)
  icons: { icon: { url: absoluteUrl("/icon.svg"), type: "image/svg+xml" }, apple: absoluteUrl("/apple-icon.png") },
};

export const viewport: Viewport = {
  themeColor: "#0b0714",
};

// Header and footer live in the route-group layouts: (site) has the full ones, checkout has its own
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body>
        {children}
        <CookieConsent />
        <FormMessages />
      </body>
    </html>
  );
}
