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

// In-page navigation: a sticky list on desktop, a row of chips on mobile. Highlights the section in view.
export function SectionNav({ sections, label }: { sections: NavSection[]; label: string }) {
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

  return (
    <nav className="section-nav" aria-label={label}>
      <ul>
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={cx(section.id === active && "is-active")}
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
