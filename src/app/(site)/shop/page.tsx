import type { Metadata } from "next";
import { Anton } from "next/font/google";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JournalArt, PosterArt, VinylArt } from "@/components/shop/ProductArt";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { SHOP_PRODUCTS } from "@/lib/shop";
import { pageMetadata } from "@/lib/site";
import "./shop.css";

// Figma: 04 · Colors / D10 · Shop 296:1002 — the new Shop design the client chose (no mobile frame; mobile is adapted).
// Only this page comes from the Colors page; the rest of the site follows the restored Desktop / Mobile wireframes.

// Display face of the new Shop design, loaded for this page only
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = pageMetadata({
  title: "Shop — Black Out Fest 2027",
  description: "Official merchandise of Black Out Fest 2027: framed art, posters, vinyl and the festival e-journal. Limited runs.",
  path: "/shop",
});

export default function ShopPage() {
  return (
    <main className={`shop-page ${anton.variable}`}>
      <div className="container shop-top">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />

        <section className="shop-hero" aria-labelledby="shop-title">
          <div className="shop-hero__copy">
            <p className="shop-hero__eyebrow">Official shop · Collection 2027</p>
            {/* The client asked for the full word instead of "merch" */}
            <h1 className="shop-hero__title" id="shop-title">
              Official merchandise drop 01
            </h1>
            <p className="shop-hero__text">
              Framed art, posters, vinyl and the festival e-journal.{" "}
              <br />
              Limited runs — once they’re gone, they’re gone.
            </p>
            <div className="shop-hero__actions">
              <a className="btn btn-primary" href="#products">
                Shop the drop
              </a>
              <a className="btn shop-hero__secondary" href="#festival-pack">
                Festival pack
              </a>
            </div>
          </div>

          <div className="shop-hero__composition" aria-hidden="true">
            <VinylArt alt="" className="shop-hero__vinyl" />
            <PosterArt alt="" className="shop-hero__poster" />
            <JournalArt alt="" className="shop-hero__journal" />
          </div>
        </section>
      </div>

      <div className="container shop-body">
        <ShopCatalog products={SHOP_PRODUCTS} />
      </div>
    </main>
  );
}
