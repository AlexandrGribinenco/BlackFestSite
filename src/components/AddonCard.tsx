import { AdaptiveText } from "./AdaptiveText";

export type AddonCardProps = {
  title: string;
  description: string;
  /** Shorter description used on mobile */
  shortDescription?: string;
  price: string;
};

export function AddonCard({ title, description, shortDescription, price }: AddonCardProps) {
  return (
    <article className="addon-card">
      <div className="placeholder addon-card__icon">Icon</div>
      <div className="addon-card__body">
        <h4 className="addon-card__title">{title}</h4>
        <p className="addon-card__text">
          <AdaptiveText full={description} short={shortDescription} />
        </p>
      </div>
      <p className="addon-card__price">{price}</p>
    </article>
  );
}
