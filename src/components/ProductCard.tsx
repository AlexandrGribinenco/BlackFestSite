export type ProductCardProps = {
  title: string;
  price: string;
  /** Pink label on the photo, e.g. "New" or "Pre-order" */
  badge?: string;
};

export function ProductCard({ title, price, badge }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="placeholder product-card__photo">
        {badge && <span className="badge badge--accent">{badge}</span>}
        Product photo
      </div>
      <div className="product-card__info">
        <div>
          <h3 className="product-card__title">{title}</h3>
          <p className="product-card__price">{price}</p>
        </div>
        <div className="swatches" aria-hidden="true">
          <span className="swatch swatch--dark" />
          <span className="swatch swatch--light" />
          <span className="swatch swatch--grey" />
        </div>
      </div>
      {/* TODO: wire up to the cart once it exists */}
      <button className="btn btn-outline btn-block product-card__add" type="button">
        Add to cart
      </button>
    </article>
  );
}
