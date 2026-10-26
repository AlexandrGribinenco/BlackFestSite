// Official shop (Figma: 04 · Colors / D10 · Shop 296:1002 — the new Shop design, the rest of that page is not used)
// TODO: replace the placeholders with the real products and prices

export type ShopCategory = "art" | "posters" | "vinyl" | "e-journal";

export const SHOP_CATEGORIES: Array<{ id: ShopCategory; label: string }> = [
  { id: "art", label: "Art" },
  { id: "posters", label: "Posters" },
  { id: "vinyl", label: "Vinyl" },
  { id: "e-journal", label: "E-journal" },
];

/** How the product is drawn until real photos arrive */
export type ProductVisual = "vinyl" | "print" | "poster" | "journal";

export type FrameColor = "black" | "white" | "grey";

export type ShopProduct = {
  id: string;
  name: string;
  price: string;
  category: ShopCategory;
  visual: ProductVisual;
  /** Big tile across two columns and two rows */
  featured?: boolean;
  badge?: "New" | "Pre-order";
  /** Limited run: the badge and the "left" bar */
  stock?: { left: number; total: number };
  /** Frame colours to choose from */
  frames?: FrameColor[];
  signed?: boolean;
  soldOut?: boolean;
  /** Digital products are bought and downloaded, not added to the cart */
  digital?: boolean;
};

export const SHOP_PRODUCTS: ShopProduct[] = [
  { id: "vinyl-lp", name: "Vinyl LP — [ARTIST / ALBUM]", price: "[PRICE]", category: "vinyl", visual: "vinyl", featured: true, stock: { left: 102, total: 300 } },
  { id: "framed-print-1", name: "Framed print — [ARTWORK 1]", price: "[PRICE]", category: "art", visual: "print", badge: "New", frames: ["black", "white", "grey"] },
  { id: "framed-print-2", name: "Framed print — [ARTWORK 2]", price: "[PRICE]", category: "art", visual: "print", frames: ["black", "white", "grey"] },
  { id: "poster-line-up", name: "Poster — Line-up 2027 (A2)", price: "[PRICE]", category: "posters", visual: "poster", badge: "Pre-order" },
  { id: "poster-signed", name: "Poster (A2, signed)", price: "[PRICE]", category: "posters", visual: "poster", signed: true, soldOut: true },
  { id: "vinyl-compilation", name: "Vinyl LP — Festival compilation", price: "[PRICE]", category: "vinyl", visual: "vinyl" },
  { id: "poster-artist", name: "Poster — [ARTIST] (A3)", price: "[PRICE]", category: "posters", visual: "poster" },
  { id: "e-journal-1", name: "E-journal · Issue #1 (PDF)", price: "[PRICE]", category: "e-journal", visual: "journal", digital: true },
];

/** Ticket + poster + vinyl bundle, shown at the end of the full list */
export const FESTIVAL_PACK = {
  items: ["Ticket", "Poster", "Vinyl"],
  oldPrice: "[PRICE]",
  price: "[PRICE]",
  saving: "Save 20%",
  number: "№ 0027",
};
