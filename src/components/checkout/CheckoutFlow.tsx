"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  CHECKOUT_STEPS,
  EMPTY_ORDER,
  HAS_SEATS,
  HOLD_SECONDS,
  SIMULATED_PAYMENT_RESULT,
  formatMoney,
  formatSeats,
  needsSeats,
  orderTotal,
  seatsComplete,
  seatsNeeded,
  ticketCount,
  type CheckoutStep,
  type Order,
  type SeatCategory,
} from "@/lib/checkout";
import { PAYMENTS_CONNECTED, startPayment } from "@/lib/payments";
import { CheckoutHeader } from "./CheckoutHeader";
import { CheckoutSteps } from "./CheckoutSteps";
import { DETAILS_FORM_ID, DetailsStep, EMPTY_DETAILS, type CustomerDetails } from "./DetailsStep";
import { DoneStep } from "./DoneStep";
import { MobileOrderBar } from "./MobileOrderBar";
import { OrderSummary } from "./OrderSummary";
import { PaymentFailed } from "./PaymentFailed";
import { PAYMENT_FORM_ID, PaymentStep } from "./PaymentStep";
import { SeatsStep } from "./SeatsStep";
import { TicketsStep } from "./TicketsStep";

const stepIndex = (step: CheckoutStep) => CHECKOUT_STEPS.findIndex((s) => s.id === step);
const stepHref = (step: CheckoutStep) => (step === "tickets" ? "/checkout" : `/checkout?step=${step}`);
// Without seated ticket types the step bar has no "Seats" step
const STEPS = HAS_SEATS ? CHECKOUT_STEPS : CHECKOUT_STEPS.filter((s) => s.id !== "seats");

function parseStep(value: string | null): CheckoutStep {
  return CHECKOUT_STEPS.some((s) => s.id === value) ? (value as CheckoutStep) : "tickets";
}

/** Keeps picked seats within the number of seated tickets of each category */
function trimSeats(order: Order): Order {
  const needed = seatsNeeded(order);
  const kept: Record<SeatCategory, number> = { A: 0, B: 0, C: 0 };
  const seats = order.seats.filter((id) => {
    const category = id[0] as SeatCategory;
    if (kept[category] >= needed[category]) return false;
    kept[category] += 1;
    return true;
  });
  return { ...order, seats };
}

// The order lives in memory only: it is gone after a reload, and the step guard sends the buyer back to step 1.
// TODO: create the order and hold seats on the ticketing backend.
export function CheckoutFlow() {
  const router = useRouter();
  const requested = parseStep(useSearchParams().get("step"));

  const [order, setOrder] = useState<Order>(EMPTY_ORDER);
  const [details, setDetails] = useState<CustomerDetails>(EMPTY_DETAILS);
  const [detailsDone, setDetailsDone] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [holdUntil, setHoldUntil] = useState<number | null>(null);
  const [holdExpired, setHoldExpired] = useState(false);

  // The seat hold starts when the buyer opens the checkout (client only, so the server render matches)
  useEffect(() => {
    if (HAS_SEATS) setHoldUntil(Date.now() + HOLD_SECONDS * 1000);
  }, []);

  const count = ticketCount(order);
  const total = formatMoney(orderTotal(order));
  const seated = needsSeats(order);

  // Furthest step the current order allows
  const maxStep: CheckoutStep = orderNumber
    ? "done"
    : count === 0
      ? "tickets"
      : seated && !seatsComplete(order)
        ? "seats"
        : detailsDone
          ? "payment"
          : "details";

  let step: CheckoutStep = orderNumber ? "done" : stepIndex(requested) <= stepIndex(maxStep) ? requested : maxStep;
  if (step === "seats" && !seated) step = "tickets";
  if (step === "done" && !orderNumber) step = maxStep;

  useEffect(() => {
    if (step !== requested) router.replace(stepHref(step));
  }, [step, requested, router]);

  const goTo = (next: CheckoutStep) => router.push(stepHref(next));
  const nextAfterTickets: CheckoutStep = seated ? "seats" : "details";

  function back() {
    if (step === "tickets") router.push("/tickets");
    else if (step === "seats") goTo("tickets");
    else if (step === "details") goTo(seated ? "seats" : "tickets");
    else if (step === "payment") goTo("details");
  }

  function setTicketQty(id: string, qty: number) {
    setOrder((prev) => trimSeats({ ...prev, tickets: { ...prev.tickets, [id]: qty } }));
  }

  function setAddonQty(id: string, qty: number) {
    setOrder((prev) => ({ ...prev, addons: { ...prev.addons, [id]: qty } }));
  }

  // Clicking a free seat when the category is full moves the oldest pick there
  function toggleSeat(id: string) {
    setOrder((prev) => {
      if (prev.seats.includes(id)) return { ...prev, seats: prev.seats.filter((s) => s !== id) };
      const category = id[0] as SeatCategory;
      const inCategory = prev.seats.filter((s) => s[0] === category);
      const seats = inCategory.length >= seatsNeeded(prev)[category] ? prev.seats.filter((s) => s !== inCategory[0]) : prev.seats;
      return { ...prev, seats: [...seats, id] };
    });
  }

  const handleHoldExpire = useCallback(() => {
    setHoldExpired(true);
    setOrder((prev) => ({ ...prev, seats: [] }));
  }, []);

  function startOver() {
    setOrder(EMPTY_ORDER);
    setDetailsDone(false);
    setHoldExpired(false);
    setPaymentFailed(false);
    if (HAS_SEATS) setHoldUntil(Date.now() + HOLD_SECONDS * 1000);
    goTo("tickets");
  }

  async function pay() {
    setProcessing(true);
    setPaymentFailed(false);
    setPaymentError(null);

    // maib: the server prices the order and returns the maib payment page; the buyer comes back to /checkout/result
    if (PAYMENTS_CONNECTED) {
      const { firstName, lastName, email, phone, acceptTerms } = details;
      const result = await startPayment(order, { firstName, lastName, email, phone }, acceptTerms);
      if ("payUrl" in result) {
        window.location.assign(result.payUrl);
        return;
      }
      setProcessing(false);
      setPaymentError(result.error);
      return;
    }

    // Not connected (the static test site): simulate the result
    setTimeout(() => {
      setProcessing(false);
      if (SIMULATED_PAYMENT_RESULT === "failure") {
        setPaymentFailed(true);
        return;
      }
      setOrderNumber(String(Math.floor(100000 + Math.random() * 900000)));
      router.push(stepHref("done"));
    }, 1200);
  }

  function renderCta(block: boolean) {
    const className = block ? "btn btn-primary btn-block checkout-cta" : "btn btn-primary checkout-cta";
    const disabled = holdExpired || processing;

    switch (step) {
      case "tickets":
        return (
          <button className={className} type="button" disabled={disabled || count === 0} onClick={() => goTo(nextAfterTickets)}>
            {seated ? "Continue to seats" : "Continue to details"}
          </button>
        );
      case "seats":
        return (
          <button className={className} type="button" disabled={disabled || !seatsComplete(order)} onClick={() => goTo("details")}>
            Continue
          </button>
        );
      case "details":
        return (
          <button className={className} type="submit" form={DETAILS_FORM_ID} disabled={disabled}>
            {block ? "Continue to payment" : "To payment"}
          </button>
        );
      case "payment":
        return paymentFailed ? (
          <button className={className} type="button" disabled={disabled} onClick={pay}>
            Try again
          </button>
        ) : (
          <button className={className} type="submit" form={PAYMENT_FORM_ID} disabled={disabled}>
            {processing ? "Processing…" : `Pay ${total}`}
          </button>
        );
      default:
        return null;
    }
  }

  const mobileBar: Record<Exclude<CheckoutStep, "done">, [string, string]> = {
    tickets: [count === 0 ? "No tickets yet" : `${count} ${count === 1 ? "ticket" : "tickets"}`, `Total ${total}`],
    seats: [formatSeats(order.seats) || "No seats picked", `Total ${total}`],
    details: [`Total ${total}`, `${count} ${count === 1 ? "ticket" : "tickets"}`],
    payment: [`Total ${total}`, "Secure payment"],
  };

  return (
    <>
      <CheckoutHeader
        onBack={step === "done" ? null : back}
        showTimer={HAS_SEATS && step !== "done"}
        holdUntil={holdUntil}
        onHoldExpire={handleHoldExpire}
      />
      <CheckoutSteps steps={STEPS} current={step} onSelect={step === "done" ? undefined : goTo} />

      <main className="checkout">
        {step === "done" && orderNumber ? (
          <div className="container">
            <DoneStep order={order} email={details.email} holder={`${details.firstName} ${details.lastName}`.trim()} orderNumber={orderNumber} />
          </div>
        ) : (
          <div className="container checkout__grid">
            <div className="checkout__main">
              {holdExpired && (
                <div className="hold-expired" role="alert">
                  <p>Your seat hold has expired and the seats were released. Start again to pick tickets and seats.</p>
                  <button className="btn btn-primary" type="button" onClick={startOver}>
                    Start over
                  </button>
                </div>
              )}

              {step === "tickets" && <TicketsStep order={order} onTicketChange={setTicketQty} onAddonChange={setAddonQty} />}
              {step === "seats" && <SeatsStep order={order} onToggleSeat={toggleSeat} onBack={back} />}
              {step === "details" && (
                <DetailsStep
                  details={details}
                  onChange={(value) => {
                    setDetails(value);
                    setDetailsDone(false);
                  }}
                  onSubmit={() => {
                    setDetailsDone(true);
                    goTo("payment");
                  }}
                  onBack={back}
                />
              )}
              {step === "payment" &&
                (paymentFailed ? (
                  <PaymentFailed holdUntil={holdUntil} onRetry={pay} onUseAnotherCard={() => setPaymentFailed(false)} />
                ) : (
                  <PaymentStep order={order} error={paymentError} onSubmit={pay} onBack={back} />
                ))}
            </div>

            <OrderSummary order={order} cta={renderCta(true)} />
          </div>
        )}
      </main>

      {step !== "done" && <MobileOrderBar primary={mobileBar[step][0]} secondary={mobileBar[step][1]} cta={renderCta(false)} />}
    </>
  );
}
