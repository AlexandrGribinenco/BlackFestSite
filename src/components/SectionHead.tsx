import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type SectionHeadProps = {
  title: string;
  titleId: string;
  eyebrow?: string;
  /** Link on the right side, e.g. "All ticket options" */
  action?: ReactNode;
  /** Smaller title, centered with the action (Partners) */
  compact?: boolean;
};

export function SectionHead({ title, titleId, eyebrow, action, compact = false }: SectionHeadProps) {
  const heading = (
    <h2 className={cx("section-title", compact && "section-title--sm")} id={titleId}>
      {title}
    </h2>
  );

  return (
    <div className={cx("section-head", compact && "section-head--compact")}>
      {eyebrow ? (
        <div>
          <p className="eyebrow">{eyebrow}</p>
          {heading}
        </div>
      ) : (
        heading
      )}
      {action}
    </div>
  );
}
