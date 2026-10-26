"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/cx";
import { AdaptiveText } from "./AdaptiveText";

export type NavSection = {
  id: string;
  label: string;
  /** Shorter label used on mobile */
  short?: string;
};

type SectionNavProps = {
  sections: NavSection[];
  label: string;
  /** "list": sticky list on desktop, chips on mobile (Info); "chips": always a row of chips (Gallery) */
  variant?: "list" | "chips";
  className?: string;
};

// In-page navigation that highlights the section in view
export function SectionNav({ sections, label, variant = "list", className }: SectionNavProps) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const targets = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const chips = variant === "chips";

  return (
    <nav className={cx("section-nav", `section-nav--${variant}`, className)} aria-label={label}>
      <ul className={chips ? "chips chips--scroll" : undefined}>
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={cx(chips && "chip", section.id === active && "is-active") || undefined}
              aria-current={section.id === active ? "location" : undefined}
              onClick={() => setActive(section.id)}
            >
              <AdaptiveText full={section.label} short={section.short} />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
