"use client";

import { useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { SHOP_CATEGORIES, type ShopCategory, type ShopProduct } from "@/lib/shop";
import { ComingSoonImage } from "../ComingSoonImage";
import { FestivalPackCard } from "./FestivalPackCard";
import { ShopProductCard } from "./ShopProductCard";

type Filter = ShopCategory | "all";
type Sort = "featured" | "name";

const SORT_LABELS: Record<Sort, string> = {
  featured: "Featured",
  name: "Name (A–Z)",
};

// Category tiles, filters and the product grid (Figma: 04 · Colors / D10 · Shop, "Section · Categories" 296:1073
// and "Section · Products" 296:1108). A category tile filters the grid and scrolls to it.
export function ShopCatalog({ products }: { products: ShopProduct[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("featured");
  const gridRef = useRef<HTMLDivElement>(null);

  const shown = products.filter((p) => filter === "all" || p.category === filter);
  if (sort === "name") shown.sort((a, b) => a.name.localeCompare(b.name));
  // The festival pack belongs to no category and is shown in the full list only
  const withPack = filter === "all";
  const count = shown.length + (withPack ? 1 : 0);

  function pickCategory(category: ShopCategory) {
    setFilter(category);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <ul className="shop-categories">
        {SHOP_CATEGORIES.map((category) => (
          <li key={category.id}>
            <button className="shop-category" type="button" onClick={() => pickCategory(category.id)}>
              <ComingSoonImage alt="" />
              <span className="shop-category__label">{category.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="shop-catalog" id="products" ref={gridRef}>
        <div className="shop-toolbar">
          <div className="shop-toolbar__filters" role="group" aria-label="Product categories">
            <ul className="chips chips--scroll">
              {[{ id: "all" as const, label: "All" }, ...SHOP_CATEGORIES].map((f) => (
                <li key={f.id}>
                  <button className={cx("chip", filter === f.id && "is-active")} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                    {f.label}
                  </button>
                </li>
              ))}
            </ul>
            <p className="shop-toolbar__count" aria-live="polite">
              {count} {count === 1 ? "product" : "products"}
            </p>
          </div>

          <label className="shop-sort">
            <span>Sort:</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              {(Object.keys(SORT_LABELS) as Sort[]).map((key) => (
                <option key={key} value={key}>
                  {SORT_LABELS[key]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <ul className="shop-grid">
          {shown.map((product) => (
            <li key={product.id} className={cx(product.featured && "shop-grid__featured") || undefined}>
              <ShopProductCard product={product} />
            </li>
          ))}
          {withPack && (
            <li>
              <FestivalPackCard />
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
