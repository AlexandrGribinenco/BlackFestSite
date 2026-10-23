import { CHECKOUT_STEPS, type CheckoutStep } from "@/lib/checkout";
import { cx } from "@/lib/cx";

type CheckoutStepsProps = {
  current: CheckoutStep;
  /** Go back to a completed step; omitted after payment */
  onSelect?: (step: CheckoutStep) => void;
};

// Desktop: numbered steps band. Mobile: "Step n of 5" with a segmented bar.
export function CheckoutSteps({ current, onSelect }: CheckoutStepsProps) {
  const currentIndex = CHECKOUT_STEPS.findIndex((s) => s.id === current);

  return (
    <nav className="checkout-steps" aria-label="Checkout progress">
      <ol className="container checkout-steps__list">
        {CHECKOUT_STEPS.map((step, i) => {
          const state = i === currentIndex ? "current" : i < currentIndex ? "done" : "todo";
          const content = (
            <>
              <span className="checkout-steps__num">{i + 1}</span>
              <span className="checkout-steps__label">{step.label}</span>
            </>
          );
          return (
            <li key={step.id} className={cx("checkout-steps__item", `is-${state}`)}>
              {state === "done" && onSelect ? (
                <button type="button" onClick={() => onSelect(step.id)}>
                  {content}
                </button>
              ) : (
                <span aria-current={state === "current" ? "step" : undefined}>{content}</span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="container checkout-progress">
        <p className="checkout-progress__head">
          <span>{CHECKOUT_STEPS[currentIndex].label}</span>
          <span>
            Step {currentIndex + 1} of {CHECKOUT_STEPS.length}
          </span>
        </p>
        <div className="checkout-progress__bar" aria-hidden="true">
          {CHECKOUT_STEPS.map((step, i) => (
            <span key={step.id} className={cx(i <= currentIndex && "is-filled")} />
          ))}
        </div>
      </div>
    </nav>
  );
}
