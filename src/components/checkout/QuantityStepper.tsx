import { MAX_PER_TYPE } from "@/lib/checkout";

type QuantityStepperProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
};

export function QuantityStepper({ label, value, onChange, max = MAX_PER_TYPE }: QuantityStepperProps) {
  return (
    <div className="stepper" role="group" aria-label={`${label} quantity`}>
      <button
        className="stepper__btn"
        type="button"
        aria-label={`Remove one ${label}`}
        disabled={value <= 0}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <output className="stepper__value" aria-live="polite">
        {value}
      </output>
      <button
        className="stepper__btn"
        type="button"
        aria-label={`Add one ${label}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}
