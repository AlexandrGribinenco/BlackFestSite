import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Black Out Fest 2027 — Music, art & culture festival",
  description: "Black Out Fest 2027 — music, art & culture festival by View Bar. Tickets, line-up, gallery and official shop.",
};

// Header and footer live in the route-group layouts: (site) has the full ones, checkout has its own
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
