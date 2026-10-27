import type { ReactNode } from "react";
import type { CartItem } from "@/lib/cart";
import { formatMoney, optionsLabel, type DeliveryMethod } from "@/lib/shop";

type ShopOrderSummaryProps = {
  step: "cart" | "delivery" | "payment";
  items: CartItem[];
  count: number;
  subtotal: string;
  /** null when the order has only digital products */
  method: DeliveryMethod | null;
  total: string;
  cta: ReactNode;
};

// Order card on the right (Figma: D12, a card per step): the subtotal in the cart, the items and the delivery
// after it, a short recap before paying
export function ShopOrderSummary({ step, items, count, subtotal, method, total, cta }: ShopOrderSummaryProps) {
  const itemsLabel = `${count} ${count === 1 ? "item" : "items"}`;

  return (
    <aside className="order-summary" aria-labelledby="order-summary-title">
      <h2 className="order-summary__title" id="order-summary-title">
        Order summary
      </h2>

      <ul className="order-lines">
        {step === "cart" && (
          <>
            <li>
              <span>Subtotal ({itemsLabel})</span>
              <strong>{subtotal}</strong>
            </li>
            <li>
              <span>Delivery</span>
              <span>{method === null ? "Download" : "Calculated next step"}</span>
            </li>
          </>
        )}

        {step === "delivery" &&
          items.map(({ key, line, product }) => (
            <li key={key}>
              <span>
                {product.shortName}
                {line.qty > 1 && ` × ${line.qty}`}
                {optionsLabel(product, line.options) && <small>{optionsLabel(product, line.options)}</small>}
              </span>
              <strong>{product.amount === null ? product.price : formatMoney(product.amount * line.qty)}</strong>
            </li>
          ))}

        {step === "payment" && (
          <li>
            <span>{itemsLabel}</span>
            <strong>{subtotal}</strong>
          </li>
        )}

        {step !== "cart" && (
          <li>
            <span>{method === null ? "Download by e-mail" : step === "payment" ? method.name : "Delivery"}</span>
            <span>{method === null ? "Free" : method.price}</span>
          </li>
        )}
      </ul>

      <p className="order-summary__total">
        <span>Total</span>
        <span>{total}</span>
      </p>

      {cta}

      <p className="order-summary__secure">
        <span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          Secure payment
        </span>
        <span>Visa · Mastercard · American Express · Apple Pay · Google Pay</span>
      </p>
    </aside>
  );
}
