import { MENU_TAGS, type MenuTag } from "@/lib/bar-menu";

const TONE_CLASS = {
  accent: "badge--accent",
  violet: "badge--violet",
  outline: "badge--outline",
} as const;

// "Hit", "Vegan", "18+" and other menu marks
export function MenuTagBadge({ tag }: { tag: MenuTag }) {
  const { label, tone } = MENU_TAGS[tag];
  return <span className={`badge bar-menu__tag ${TONE_CLASS[tone]}`}>{label}</span>;
}
