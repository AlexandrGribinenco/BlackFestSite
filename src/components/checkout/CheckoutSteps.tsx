import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";

type CheckoutStepsProps<Step extends string> = {
  steps: Array<{ id: Step; label: string }>;
  current: Step;
  /** Go back to a completed step; omitted after payment */
  onSelect?: (step: Step) => void;
};

// Desktop: numbered steps band. Mobile: "Step n of N" with a segmented bar.
// Used by the ticket checkout (5 steps) and the shop cart (4 steps).
export function CheckoutSteps<Step extends string>({ steps, current, onSelect }: CheckoutStepsProps<Step>) {
  const currentIndex = steps.findIndex((s) => s.id === current);

  return (
    <nav className="checkout-steps" aria-label="Checkout progress">
      <ol className="container checkout-steps__list">
        {steps.map((step, i) => {
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
          <span>{steps[currentIndex].label}</span>
          <span>
            Step {currentIndex + 1} of {steps.length}
          </span>
        </p>
        <div className="checkout-progress__bar" style={{ "--steps": steps.length } as CSSProperties} aria-hidden="true">
          {steps.map((step, i) => (
            <span key={step.id} className={cx(i <= currentIndex && "is-filled")} />
          ))}
        </div>
      </div>
    </nav>
  );
}
