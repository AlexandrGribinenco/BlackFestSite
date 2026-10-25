import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StatePanel } from "@/components/StatePanel";

// Figma: D8 "404 page". Rendered for unknown URLs and notFound(), outside the (site) layout,
// so it adds the site header and footer itself.

export const metadata: Metadata = {
  title: "Page not found — Black Out Fest 2027",
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="container state-page">
        <StatePanel
          code="404"
          title="This page went dark"
          text="The page doesn’t exist or was moved."
          actions={
            <>
              <Link className="btn btn-outline" href="/">
                Go home
              </Link>
              <Link className="btn btn-outline" href="/tickets">
                Buy tickets
              </Link>
            </>
          }
        />
      </main>
      <SiteFooter />
    </>
  );
}
