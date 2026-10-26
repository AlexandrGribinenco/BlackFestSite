"use client";

import { useState } from "react";
import { cx } from "@/lib/cx";
import type { FrameColor, ShopProduct } from "@/lib/shop";
import { JournalArt, PosterArt, PrintArt, VinylArt } from "./ProductArt";

// Product tile of the shop grid (Figma: 04 · Colors / D10 · Shop, "Bento · row 1" 296:1109 and "row 2" 296:1218)
export function ShopProductCard({ product }: { product: ShopProduct }) {
  const [frame, setFrame] = useState<FrameColor>(product.frames?.[0] ?? "black");
  const alt = `${product.name} — photo coming soon`;
  const soldPercent = product.stock ? Math.round(((product.stock.total - product.stock.left) / product.stock.total) * 100) : 0;

  return (
    <article className={cx("shop-card", product.featured && "shop-card--featured")}>
      <div className={`shop-card__media shop-card__media--${product.visual}`}>
        {product.visual === "vinyl" && <VinylArt alt={alt} />}
        {product.visual === "print" && <PrintArt alt={alt} frame={frame} />}
        {product.visual === "poster" && <PosterArt alt={alt} />}
        {product.visual === "journal" && <JournalArt alt={alt} />}

        {product.stock && (
          <div className="shop-card__stock">
            <span className="badge badge--accent">Limited · {product.stock.total} pcs</span>
            <p>
              {product.stock.left} of {product.stock.total} left
            </p>
            <span className="shop-card__stock-bar" aria-hidden="true">
              <span style={{ width: `${soldPercent}%` }} />
            </span>
          </div>
        )}
        {product.badge && <span className="badge badge--accent shop-card__badge">{product.badge}</span>}
        {product.soldOut && <span className="shop-stamp shop-stamp--sold-out">Sold out</span>}
        {product.signed && <span className="shop-stamp shop-stamp--signed">Signed</span>}
      </div>

      <div className="shop-card__info">
        <div>
          <h3 className="shop-card__name">{product.name}</h3>
          <p className="shop-card__price">{product.price}</p>
        </div>
        {product.frames && (
          <div className="shop-card__frames" role="radiogroup" aria-label="Frame colour">
            {product.frames.map((color) => (
              <button
                key={color}
                className={cx("shop-swatch", `shop-swatch--${color}`, frame === color && "is-selected")}
                type="button"
                role="radio"
                aria-checked={frame === color}
                aria-label={`${color} frame`}
                onClick={() => setFrame(color)}
              />
            ))}
          </div>
        )}
      </div>

      {/* TODO: wire up to the cart, the download and the restock notification */}
      {product.soldOut ? (
        <button className="btn btn-block shop-card__button" type="button">
          Sold out · Notify me
        </button>
      ) : (
        <button className={cx("btn btn-block", product.featured ? "btn-primary" : "shop-card__button")} type="button">
          {product.digital ? "Buy & download" : "Add to cart"}
        </button>
      )}
    </article>
  );
}
