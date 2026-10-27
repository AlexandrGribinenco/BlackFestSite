"use client";

import Link from "next/link";
import { useState } from "react";
import { setLineQty, type CartItem } from "@/lib/cart";
import { formatMoney } from "@/lib/checkout";
import { MAX_PER_PRODUCT, optionsLabel } from "@/lib/shop";
import { QuantityStepper } from "../checkout/QuantityStepper";
import { PromoCode } from "../checkout/TicketsStep";
import { ProductArt } from "../shop/ProductArt";

// Step 1 (Figma: D12 "Your cart" 347:141, M11 3:12334)
export function CartStep({ items, count }: { items: CartItem[]; count: number }) {
  const [promoOpen, setPromoOpen] = useState(false);

  return (
    <section aria-labelledby="checkout-step-title">
      <h1 className="checkout-title" id="checkout-step-title">
        Your cart ({count})
      </h1>

      {items.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link className="btn btn-primary" href="/shop">
            Go to the shop
          </Link>
        </div>
      ) : (
        <ul className="cart-lines">
          {items.map(({ key, line, product }) => {
            const href = `/shop/${product.id}`;
            return (
              <li key={key} className="cart-line">
                <Link className={`cart-line__media cart-line__media--${product.visual}`} href={href} tabIndex={-1} aria-hidden="true">
                  <ProductArt product={product} frame={line.options.frame} alt="" />
                </Link>
                <div className="cart-line__info">
                  <Link className="cart-line__name" href={href}>
                    {product.name}
                  </Link>
                  <p className="cart-line__options">{[optionsLabel(product, line.options), product.digital && "Download"].filter(Boolean).join(" · ")}</p>
                </div>
                <QuantityStepper label={product.shortName} value={line.qty} min={1} max={MAX_PER_PRODUCT} onChange={(qty) => setLineQty(key, qty)} />
                <p className="cart-line__price">{product.amount === null ? product.price : formatMoney(product.amount * line.qty)}</p>
                <button className="cart-line__remove" type="button" aria-label={`Remove ${product.shortName}`} onClick={() => setLineQty(key, 0)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="cart-more">
        <Link className="cart-more__link" href="/shop">
          Continue shopping
        </Link>
        {items.length > 0 && (
          <button className="link-button cart-more__promo" type="button" aria-expanded={promoOpen} onClick={() => setPromoOpen((open) => !open)}>
            Have a promo code?
          </button>
        )}
      </div>
      {promoOpen && <PromoCode />}

      <div className="cart-upsell">
        <div>
          <p className="cart-upsell__title">Going to the festival?</p>
          <p className="cart-upsell__text">Add a ticket and pick up your order at the entrance for free.</p>
        </div>
        <Link className="btn btn-outline" href="/tickets">
          Add ticket
        </Link>
      </div>
    </section>
  );
}
