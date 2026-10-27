"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { SIMULATED_PAYMENT_RESULT } from "@/lib/checkout";
import { cartCount, cartItems, cartSubtotal, clearCart, useCart } from "@/lib/cart";
import { PAYMENTS_CONNECTED } from "@/lib/payments";
import { DELIVERY_METHODS, formatMoney, type DeliveryMethod } from "@/lib/shop";
import { CheckoutSteps } from "../checkout/CheckoutSteps";
import { MobileOrderBar } from "../checkout/MobileOrderBar";
import { CartStep } from "./CartStep";
import { DELIVERY_FORM_ID, DeliveryStep, EMPTY_CONTACT, type ShopContact } from "./DeliveryStep";
import { ShopDoneStep } from "./ShopDoneStep";
import { ShopOrderSummary } from "./ShopOrderSummary";
import { SHOP_PAYMENT_FORM_ID, ShopPaymentStep } from "./ShopPaymentStep";

type ShopStep = "cart" | "delivery" | "payment" | "done";

const SHOP_STEPS: Array<{ id: ShopStep; label: string }> = [
  { id: "cart", label: "Cart" },
  { id: "delivery", label: "Delivery" },
  { id: "payment", label: "Payment" },
  { id: "done", label: "Done" },
];

const stepIndex = (step: ShopStep) => SHOP_STEPS.findIndex((s) => s.id === step);
const stepHref = (step: ShopStep) => (step === "cart" ? "/cart" : `/cart?step=${step}`);

function parseStep(value: string | null): ShopStep {
  return SHOP_STEPS.some((s) => s.id === value) ? (value as ShopStep) : "cart";
}

const subscribeNothing = () => () => {};

type PlacedOrder = { number: string; email: string; method: DeliveryMethod | null };

// Cart and shop checkout (Figma: Desktop / D12 · Cart + shop checkout 347:141, Mobile / M11 3:12334).
// The cart lives in localStorage (lib/cart.ts); the contacts only in memory, like the ticket checkout.
export function ShopCheckout() {
  const router = useRouter();
  const requested = parseStep(useSearchParams().get("step"));
  // The cart is read from localStorage after hydration; until then the step guard waits
  const hydrated = useSyncExternalStore(subscribeNothing, () => true, () => false);

  const items = cartItems(useCart());
  const count = cartCount(items.map((item) => item.line));
  const needsDelivery = items.some((item) => !item.product.digital);
  const digitalOnly = items.length > 0 && !needsDelivery;

  const [methodId, setMethodId] = useState<DeliveryMethod["id"]>("pickup");
  const [contact, setContact] = useState<ShopContact>(EMPTY_CONTACT);
  const [contactDone, setContactDone] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);

  const method = DELIVERY_METHODS.find((m) => m.id === methodId) ?? DELIVERY_METHODS[0];
  const subtotal = cartSubtotal(items);
  const deliveryAmount = needsDelivery ? method.amount : 0;
  const total = subtotal === null || deliveryAmount === null ? null : subtotal + deliveryAmount;
  const totalLabel = formatMoney(total, "[TOTAL]");

  // Furthest step the cart allows
  const maxStep: ShopStep = placed ? "done" : items.length === 0 ? "cart" : contactDone ? "payment" : "delivery";
  const step: ShopStep = placed ? "done" : stepIndex(requested) <= stepIndex(maxStep) && requested !== "done" ? requested : maxStep;

  useEffect(() => {
    if (hydrated && step !== requested) router.replace(stepHref(step));
  }, [hydrated, step, requested, router]);

  const goTo = (next: ShopStep) => router.push(stepHref(next));

  function back() {
    if (step === "delivery") goTo("cart");
    else if (step === "payment") goTo("delivery");
  }

  async function pay() {
    setPaymentError(null);

    // TODO: shop orders on the server: price the cart and the delivery, keep the address for the courier, then the maib
    // payment as for tickets (docs/payments-maib.md). Until then a real payment can't be taken for the shop.
    if (PAYMENTS_CONNECTED) {
      setPaymentError("Online payment for shop orders opens soon. Please try again later.");
      return;
    }

    // Not connected (the static test site): simulate the result
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      if (SIMULATED_PAYMENT_RESULT === "failure") {
        setPaymentError("The payment didn’t go through. No money was taken. Try again or use another card.");
        return;
      }
      setPlaced({ number: `M-${String(Math.floor(100000 + Math.random() * 900000))}`, email: contact.email, method: needsDelivery ? method : null });
      clearCart();
      router.push(stepHref("done"));
    }, 1200);
  }

  function renderCta(block: boolean) {
    const className = block ? "btn btn-primary btn-block checkout-cta" : "btn btn-primary checkout-cta";

    switch (step) {
      case "cart":
        return (
          <button className={className} type="button" disabled={items.length === 0} onClick={() => goTo("delivery")}>
            Checkout
          </button>
        );
      case "delivery":
        return (
          <button className={className} type="submit" form={DELIVERY_FORM_ID}>
            {block ? "Continue to payment" : "Continue"}
          </button>
        );
      case "payment":
        return (
          <button className={className} type="submit" form={SHOP_PAYMENT_FORM_ID} disabled={processing}>
            {processing ? "Processing…" : `Pay ${totalLabel}`}
          </button>
        );
      default:
        return null;
    }
  }

  const deliveryLine = needsDelivery ? `${method.name} · ${method.price}` : "Download by e-mail";
  const mobileBar: Record<Exclude<ShopStep, "done">, string> = {
    cart: digitalOnly ? `${count} ${count === 1 ? "item" : "items"}` : "Delivery on next step",
    delivery: deliveryLine,
    payment: "Secure payment",
  };

  return (
    <>
      <CheckoutSteps steps={SHOP_STEPS} current={step} onSelect={step === "done" ? undefined : goTo} />

      <main className="checkout cart-page">
        {step === "done" && placed ? (
          <div className="container">
            <ShopDoneStep orderNumber={placed.number} email={placed.email} method={placed.method} />
          </div>
        ) : (
          <div className="container checkout__grid">
            <div className="checkout__main">
              {step === "cart" && <CartStep items={items} count={count} />}
              {step === "delivery" && (
                <DeliveryStep
                  needsDelivery={needsDelivery}
                  method={method}
                  onMethodChange={(id) => {
                    setMethodId(id);
                    setContactDone(false);
                  }}
                  contact={contact}
                  onChange={(value) => {
                    setContact(value);
                    setContactDone(false);
                  }}
                  onSubmit={() => {
                    setContactDone(true);
                    goTo("payment");
                  }}
                  onBack={back}
                />
              )}
              {step === "payment" && <ShopPaymentStep error={paymentError} onSubmit={pay} onBack={back} />}
            </div>

            <ShopOrderSummary
              step={step === "done" ? "payment" : step}
              items={items}
              count={count}
              subtotal={formatMoney(subtotal)}
              method={digitalOnly ? null : method}
              total={totalLabel}
              cta={renderCta(true)}
            />
          </div>
        )}
      </main>

      {step !== "done" && items.length > 0 && <MobileOrderBar primary={`Total ${totalLabel}`} secondary={mobileBar[step]} cta={renderCta(false)} />}
    </>
  );
}
