import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHead } from "@/components/SectionHead";
import { ProductArt } from "@/components/shop/ProductArt";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { DELIVERY_METHODS, SHOP_PRODUCTS, productById, type ShopProduct } from "@/lib/shop";
import "./product.css";

// Figma: Desktop / D11 · Product page 347:807, Mobile / M10 · Product page 3:12030 — the restored wireframes,
// not the Colors page the Shop list comes from.

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return SHOP_PRODUCTS.map((product) => ({ slug: product.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = productById((await params).slug);
  return product ? { title: `${product.name} — Shop — Black Out Fest 2027`, description: product.summary } : {};
}

export default async function ProductPage({ params }: Params) {
  const product = productById((await params).slug);
  if (!product) notFound();

  const related = SHOP_PRODUCTS.filter((p) => p.id !== product.id && !p.soldOut).slice(0, 4);

  return (
    <main className="product-page">
      <div className="container product-top">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: product.shortName }]} />
        {/* Mobile has a back link instead of the breadcrumbs (Figma: M10) */}
        <Link className="product-back" href="/shop">
          Shop
        </Link>

        <ProductDetail product={product}>
          <ProductAccordion product={product} />
        </ProductDetail>
      </div>

      <section className="product-related" aria-labelledby="related-title">
        <div className="container">
          <SectionHead
            title="You may also like"
            titleId="related-title"
            action={
              <Link className="link-arrow" href="/shop">
                Shop all
              </Link>
            }
          />
          <ul className="product-related__grid">
            {related.map((item) => (
              <li key={item.id}>
                <Link className="product-tile" href={`/shop/${item.id}`}>
                  <span className={`product-tile__media product-tile__media--${item.visual}`}>
                    <ProductArt product={item} alt="" />
                  </span>
                  <span className="product-tile__name">{item.name}</span>
                  <span className="product-tile__price">{item.price}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

// Detailed description, as maib requires for every product
function ProductAccordion({ product }: { product: ShopProduct }) {
  return (
    <div className="product-accordion">
      <details open>
        <summary>Description</summary>
        <div className="product-accordion__body">
          {product.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <dl className="product-specs">
            {product.specs.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </details>

      {product.tracklist && (
        <details id="tracklist">
          <summary>Tracklist</summary>
          <div className="product-accordion__body">
            <ol className="product-tracklist">
              {product.tracklist.map((track) => (
                <li key={track}>{track}</li>
              ))}
            </ol>
          </div>
        </details>
      )}

      <details>
        <summary>Packaging &amp; condition</summary>
        <div className="product-accordion__body">
          <p>{product.packaging}</p>
        </div>
      </details>

      <details>
        <summary>Delivery &amp; returns</summary>
        <div className="product-accordion__body">
          {product.digital ? (
            <p>The download link comes by e-mail right after the payment.</p>
          ) : (
            <ul>
              {DELIVERY_METHODS.map((method) => (
                <li key={method.id}>
                  <strong>{method.name}</strong> — {method.price}. {method.note}.
                </li>
              ))}
            </ul>
          )}
          <p>
            Returns: [RETURN RULES]. See the <Link href="/legal/terms">Terms &amp; Conditions</Link>.
          </p>
        </div>
      </details>
    </div>
  );
}
