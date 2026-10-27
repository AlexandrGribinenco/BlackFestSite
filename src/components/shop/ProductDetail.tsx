"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import { addToCart } from "@/lib/cart";
import { cx } from "@/lib/cx";
import { DELIVERY_METHODS, MAX_PER_PRODUCT, defaultOptions, type ProductVisual, type ShopProduct } from "@/lib/shop";
import { ComingSoonImage } from "../ComingSoonImage";
import { QuantityStepper } from "../checkout/QuantityStepper";
import { Lightbox } from "../gallery/Lightbox";
import { ProductArt } from "./ProductArt";

// Views of the product until the real photos arrive; the first one is the drawn mock-up
const VIEWS: Record<ProductVisual, string[]> = {
  vinyl: ["Cover", "Back", "Vinyl", "Details"],
  print: ["Front", "Detail", "On the wall", "Back"],
  poster: ["Front", "Detail", "On the wall", "Packaging"],
  journal: ["Cover", "Spread", "Spread", "Contents"],
};

type ProductDetailProps = {
  product: ShopProduct;
  /** Description, tracklist, packaging and delivery, rendered on the server */
  children: ReactNode;
};

// Photos and the buy box (Figma: Desktop / D11 · Product page 347:807, Mobile / M10 3:12030)
export function ProductDetail({ product, children }: ProductDetailProps) {
  const router = useRouter();
  const [options, setOptions] = useState(() => defaultOptions(product));
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const views = VIEWS[product.visual];

  function add(goToCart: boolean) {
    addToCart(product.id, options, qty);
    if (goToCart) {
      router.push("/cart");
      return;
    }
    setAdded(true);
  }

  function openTracklist() {
    const tracklist = document.getElementById("tracklist") as HTMLDetailsElement | null;
    if (!tracklist) return;
    tracklist.open = true;
    tracklist.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="product-hero">
      <ProductGallery product={product} frame={options.frame} views={views} />

      <div className="product-info">
        <div className="product-info__badges">
          {product.badge && <span className="badge badge--accent">{product.badge}</span>}
          {product.stock && <span className="badge badge--outline">Limited edition</span>}
          {product.signed && <span className="badge badge--outline">Signed</span>}
        </div>
        <h1 className="product-info__title">{product.name}</h1>
        {product.subtitle && <p className="product-info__subtitle">{product.subtitle}</p>}
        <p className="product-info__price">{product.price}</p>
        <p className="product-info__summary">{product.summary}</p>

        {product.options?.map((option) => {
          const picked = option.values.find((v) => v.id === options[option.id]);
          const swatches = option.values.every((v) => v.color);
          return (
            <div key={option.id} className="product-option" role="radiogroup" aria-label={option.label}>
              <p className="product-option__label">
                {option.label}
                {swatches && picked && `: ${picked.label}`}
              </p>
              <div className={swatches ? "product-option__swatches" : "product-option__chips"}>
                {option.values.map((value) => (
                  <button
                    key={value.id}
                    className={cx(swatches ? "product-swatch" : "product-chip", options[option.id] === value.id && "is-selected")}
                    style={swatches ? { background: value.color } : undefined}
                    type="button"
                    role="radio"
                    aria-checked={options[option.id] === value.id}
                    aria-label={swatches ? value.label : undefined}
                    onClick={() => {
                      setOptions({ ...options, [option.id]: value.id });
                      setAdded(false);
                    }}
                  >
                    {swatches ? null : value.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {product.tracklist && (
          <a className="product-info__tracklist" href="#tracklist" onClick={openTracklist}>
            Tracklist
          </a>
        )}

        {product.soldOut ? (
          <div className="product-buy">
            <button className="btn btn-block product-buy__button" type="button" disabled>
              Sold out
            </button>
          </div>
        ) : (
          <>
            <div className="product-qty">
              <span className="product-qty__label">Quantity</span>
              <QuantityStepper label={product.shortName} value={qty} min={1} max={Math.min(MAX_PER_PRODUCT, product.stock?.left ?? MAX_PER_PRODUCT)} onChange={setQty} />
              {product.stock && <span className="product-qty__left">Only {product.stock.left} left</span>}
            </div>

            <div className="product-buy">
              <button className="btn btn-primary btn-block product-buy__button" type="button" onClick={() => add(false)}>
                <span className="only-desktop">Add to cart</span>
                <span className="only-mobile">Add to cart · {product.price}</span>
              </button>
              <button className="btn btn-outline btn-block product-buy__button product-buy__now" type="button" onClick={() => add(true)}>
                Buy now
              </button>
            </div>
            <p className="product-buy__status" role="status">
              {added && (
                <>
                  Added to cart. <Link href="/cart">View cart</Link>
                </>
              )}
            </p>
          </>
        )}

        <ul className="product-delivery">
          {product.digital ? (
            <li>
              <strong>Digital download</strong> — link by e-mail after payment
            </li>
          ) : (
            DELIVERY_METHODS.map((method) => (
              <li key={method.id}>
                <strong>{method.name}</strong> — {method.amount === 0 ? "free" : [method.price, method.time].filter(Boolean).join(", ")}
              </li>
            ))
          )}
        </ul>

        {children}
      </div>
    </div>
  );
}

type ProductGalleryProps = {
  product: ShopProduct;
  frame?: string;
  views: string[];
};

// Desktop: thumbnails beside the photo. Mobile: the photos swipe, with dots under them. A photo opens full screen.
function ProductGallery({ product, frame, views }: ProductGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [zoomed, setZoomed] = useState<number | null>(null);

  function show(index: number) {
    const track = trackRef.current;
    if (track) track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
    setCurrent(index);
  }

  function handleScroll() {
    const track = trackRef.current;
    if (track && track.clientWidth > 0) setCurrent(Math.round(track.scrollLeft / track.clientWidth));
  }

  return (
    <div className="product-gallery">
      <div className="product-gallery__thumbs">
        {views.map((view, i) => (
          <button
            key={i}
            className={cx("product-gallery__thumb", i === current && "is-selected")}
            type="button"
            aria-label={`Show photo ${i + 1}: ${view}`}
            aria-pressed={i === current}
            onClick={() => show(i)}
          >
            {i === 0 ? <ProductArt product={product} frame={frame} alt="" /> : <ComingSoonImage alt="" />}
          </button>
        ))}
      </div>

      <div className="product-gallery__main">
        <div className="product-gallery__track" ref={trackRef} onScroll={handleScroll}>
          {views.map((view, i) => (
            <button key={i} className="product-gallery__slide" type="button" aria-label={`${view}, open full screen`} onClick={() => setZoomed(i)}>
              {i === 0 ? (
                <ProductArt product={product} frame={frame} alt={`${product.name} — photo coming soon`} className="product-gallery__art" />
              ) : (
                <span className="placeholder product-gallery__photo">
                  <ComingSoonImage alt={`${view} — photo coming soon`} />
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="product-gallery__dots" aria-hidden="true">
          {views.map((_, i) => (
            <span key={i} className={cx(i === current && "is-active")} />
          ))}
        </div>
      </div>

      <Lightbox items={views.map((view) => `${product.shortName} · ${view}`)} index={zoomed} onIndexChange={setZoomed} />
    </div>
  );
}
