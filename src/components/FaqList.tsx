import { AdaptiveText } from "./AdaptiveText";
import { Skeleton } from "./Skeleton";

export type FaqItem = {
  question: string;
  /** Shorter wording used on mobile */
  short?: string;
};

// Questions with grey placeholder answers, as in the wireframes (Tickets, Info)
// TODO: real answers
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq-list">
      {items.map((item) => (
        <div key={item.question} className="faq-item">
          <h3 className="faq-item__question">
            <AdaptiveText full={item.question} short={item.short} />
          </h3>
          <Skeleton size="sm" widths={[undefined, "70%"]} />
        </div>
      ))}
    </div>
  );
}
