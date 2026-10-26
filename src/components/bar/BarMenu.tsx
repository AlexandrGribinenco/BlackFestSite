"use client";

import { useState } from "react";
import { cx } from "@/lib/cx";
import type { MenuCategory } from "@/lib/bar-menu";
import { MenuTagBadge } from "./MenuTagBadge";

const ALL = "all";

// Menu with category filters (Figma: D13 "Nav · Menu categories" 347:5998 and "Menu grid" 347:6012).
// Desktop: two columns, categories alternate between them. Mobile: one column, filters stick under the header.
export function BarMenu({ categories }: { categories: MenuCategory[] }) {
  const [filter, setFilter] = useState(ALL);
  const visible = filter === ALL ? categories : categories.filter((c) => c.id === filter);
  const columns = [visible.filter((_, i) => i % 2 === 0), visible.filter((_, i) => i % 2 === 1)];

  const filters = [{ id: ALL, name: "All" }, ...categories];

  return (
    <div className="bar-menu">
      <div className="bar-menu__filters" role="group" aria-label="Menu categories">
        <ul className="chips chips--scroll">
          {filters.map((f) => (
            <li key={f.id}>
              <button className={cx("chip", filter === f.id && "is-active")} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="bar-menu__columns">
        {columns.map((column, c) => (
          <div key={c} className="bar-menu__column">
            {column.map((category) => (
              // On mobile the columns merge and `order` restores the original sequence
              <section key={category.id} className="bar-menu__category" style={{ order: visible.indexOf(category) }} aria-labelledby={`menu-${category.id}`}>
                <div className="bar-menu__head">
                  <h3 className="bar-menu__title" id={`menu-${category.id}`}>
                    {category.name}
                  </h3>
                  <p className="bar-menu__count">{category.items.length} items</p>
                </div>
                <ul>
                  {category.items.map((item) => (
                    <li key={item.name} className="bar-menu__item">
                      <div>
                        <p className="bar-menu__name">
                          {item.name}
                          {item.tags?.map((tag) => <MenuTagBadge key={tag} tag={tag} />)}
                        </p>
                        <p className="bar-menu__description">{item.description}</p>
                      </div>
                      <p className="bar-menu__price">
                        {item.price}
                        {item.portion && <span className="bar-menu__portion">{item.portion}</span>}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
