"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addToCart } from "@/lib/cart";
import { cx } from "@/lib/cx";
import { defaultOptions, type ShopProduct } from "@/lib/shop";
import { ProductArt } from "./ProductArt";

// Product tile of the shop grid (Figma: 04 · Colors / D10 · Shop, "Bento · row 1" 296:1109 and "row 2" 296:1218).
// The photo and the name open the product page; the button adds the product with its first options.
export function ShopProductCard({ product }: { product: ShopProduct }) {
  const router = useRouter();
  const [options, setOptions] = useState(() => defaultOptions(product));
  const [added, setAdded] = useState(false);
  const frameOption = product.visual === "print" ? product.options?.find((o) => o.id === "frame") : undefined;
  const href = `/shop/${product.id}`;
  const soldPercent = product.stock ? Math.round(((product.stock.total - product.stock.left) / product.stock.total) * 100) : 0;

  function add() {
    addToCart(product.id, options);
    // A digital product needs no more choices: straight to the cart
    if (product.digital) {
      router.push("/cart");
      return;
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <article className={cx("shop-card", product.featured && "shop-card--featured")}>
      <Link className={`shop-card__media shop-card__media--${product.visual}`} href={href} tabIndex={-1} aria-hidden="true">
        <ProductArt product={product} frame={options.frame} alt="" />

        {product.stock && (
          <div className="shop-card__stock">
            <span className="badge badge--accent">Limited · {product.stock.total} pcs</span>
            <p>
              {product.stock.left} of {product.stock.total} left
            </p>
            <span className="shop-card__stock-bar">
              <span style={{ width: `${soldPercent}%` }} />
            </span>
          </div>
        )}
        {product.badge && <span className="badge badge--accent shop-card__badge">{product.badge}</span>}
        {product.soldOut && <span className="shop-stamp shop-stamp--sold-out">Sold out</span>}
        {product.signed && <span className="shop-stamp shop-stamp--signed">Signed</span>}
      </Link>

      <div className="shop-card__info">
        <div>
          <h3 className="shop-card__name">
            <Link href={href}>{product.name}</Link>
          </h3>
          <p className="shop-card__price">{product.price}</p>
        </div>
        {frameOption && (
          <div className="shop-card__frames" role="radiogroup" aria-label="Frame colour">
            {frameOption.values.map((value) => (
              <button
                key={value.id}
                className={cx("shop-swatch", `shop-swatch--${value.id}`, options.frame === value.id && "is-selected")}
                type="button"
                role="radio"
                aria-checked={options.frame === value.id}
                aria-label={value.label}
                onClick={() => setOptions({ ...options, frame: value.id })}
              />
            ))}
          </div>
        )}
      </div>

      {/* TODO: the restock notification */}
      {product.soldOut ? (
        <button className="btn btn-block shop-card__button" type="button">
          Sold out · Notify me
        </button>
      ) : (
        <button className={cx("btn btn-block", product.featured ? "btn-primary" : "shop-card__button")} type="button" onClick={add}>
          {added ? "Added to cart" : product.digital ? "Buy & download" : "Add to cart"}
        </button>
      )}
    </article>
  );
}
