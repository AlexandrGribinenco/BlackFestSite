import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";

type SkeletonProps = {
  /** One entry per grey line; a missing width means a full-width line. */
  widths: Array<string | undefined>;
  size?: "md" | "sm";
  className?: string;
};

// Grey bars that stand in for paragraphs of text in the wireframes
export function Skeleton({ widths, size = "md", className }: SkeletonProps) {
  return (
    <div className={cx("skeleton", size === "sm" && "skeleton--sm", className)} aria-hidden="true">
      {widths.map((width, i) => (
        <span key={i} style={width ? ({ "--w": width } as CSSProperties) : undefined} />
      ))}
    </div>
  );
}
