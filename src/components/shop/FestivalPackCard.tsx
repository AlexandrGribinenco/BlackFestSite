import { FESTIVAL_PACK } from "@/lib/shop";

// Ticket + poster + vinyl bundle styled as a ticket (Figma: 04 · Colors / D10 · Shop, "Festival pack · ticket" 296:1266)
export function FestivalPackCard() {
  const { items, oldPrice, price, saving, number } = FESTIVAL_PACK;

  return (
    <article className="pack-card" id="festival-pack" aria-labelledby="festival-pack-title">
      <div className="pack-card__top">
        <p className="pack-card__eyebrow">Festival pack</p>
        <h3 className="pack-card__title" id="festival-pack-title">
          {items.map((item, i) => (
            <span key={item}>
              {i > 0 && "+ "}
              {item}
            </span>
          ))}
        </h3>
        <p className="pack-card__old-price">
          <s>{oldPrice}</s>
        </p>
        <p className="pack-card__price">{price}</p>
        <span className="pack-card__saving">{saving}</span>
      </div>

      <div className="pack-card__stub">
        <div>
          <span className="pack-card__barcode" aria-hidden="true" />
          <p className="pack-card__number">{number}</p>
        </div>
        {/* TODO: wire up to the cart once it exists */}
        <button className="btn pack-card__button" type="button">
          Get the pack
        </button>
      </div>
    </article>
  );
}
