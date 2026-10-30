import Link from "next/link";
import { EVENT } from "@/lib/event";
import type { DeliveryMethod } from "@/lib/shop";

type ShopDoneStepProps = {
  orderNumber: string;
  email: string;
  /** null when the order has only digital products */
  method: DeliveryMethod | null;
};

// Step 4 (Figma: D12 "Order confirmed!" 347:141, M11 3:12334)
export function ShopDoneStep({ orderNumber, email, method }: ShopDoneStepProps) {
  return (
    <section className="done" aria-labelledby="checkout-step-title">
      <div className="done__icon" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>
      <h1 className="done__title" id="checkout-step-title">
        Order confirmed!
      </h1>
      <p className="done__text">
        Order #{orderNumber} · confirmation sent to <strong>{email}</strong>
      </p>

      <article className="done-ticket" aria-label="How you get your order">
        {/* TODO: real QR code of the order */}
        {method?.id === "pickup" && <div className="placeholder done-ticket__qr">QR</div>}
        <div className="done-ticket__info">
          {method === null ? (
            <>
              <p className="done-ticket__event">Download by e-mail</p>
              <p>The download link is in the confirmation e-mail.</p>
            </>
          ) : method.id === "pickup" ? (
            <>
              <p className="done-ticket__event">{method.name}</p>
              <p>Pick-up point at the entrance · {EVENT.date}</p>
              <p className="done-ticket__note">Show this QR to collect your order. For courier delivery we send a tracking link instead.</p>
            </>
          ) : (
            <>
              <p className="done-ticket__event">{method.name}</p>
              <p>{method.note}</p>
              <p className="done-ticket__note">We send the tracking link to your e-mail when the order ships.</p>
            </>
          )}
        </div>
      </article>

      <div className="done__actions">
        <Link className="btn btn-outline" href="/shop">
          Back to shop
        </Link>
        <Link className="btn btn-primary" href="/tickets">
          Get festival tickets
        </Link>
      </div>
    </section>
  );
}
