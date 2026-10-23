import type { ReactNode } from "react";

type MobileOrderBarProps = {
  primary: string;
  secondary: string;
  cta: ReactNode;
};

// Sticky bottom bar that replaces the order summary card on small screens (Figma: M4.1–M4.4)
export function MobileOrderBar({ primary, secondary, cta }: MobileOrderBarProps) {
  return (
    <div className="mobile-order-bar">
      <div className="container mobile-order-bar__inner">
        <div>
          <p className="mobile-order-bar__primary">{primary}</p>
          <p className="mobile-order-bar__secondary">{secondary}</p>
        </div>
        {cta}
      </div>
    </div>
  );
}
