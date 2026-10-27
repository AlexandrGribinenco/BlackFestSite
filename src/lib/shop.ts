// Official shop. The Shop page follows Figma: 04 · Colors / D10 · Shop 296:1002 (the new design the client chose); the
// product page and the cart follow the restored wireframes: Desktop / D11 347:807, D12 347:141, Mobile / M10, M11.
// TODO: replace the placeholders with the real products, descriptions and prices

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

/** A choice the buyer makes on the product page: shown as colour swatches when the values have a colour, else as chips */
export type ProductOption = {
  id: string;
  label: string;
  values: Array<{ id: string; label: string; color?: string }>;
};

export type ShopProduct = {
  /** Also the page address: /shop/<id> */
  id: string;
  name: string;
  /** Name for the breadcrumbs and the order lines, e.g. "Vinyl LP" */
  shortName: string;
  subtitle?: string;
  price: string;
  /** Price as a number in CURRENCY, used to charge the card; null until the real prices are set */
  amount: number | null;
  category: ShopCategory;
  visual: ProductVisual;
  /** Big tile across two columns and two rows */
  featured?: boolean;
  badge?: "New" | "Pre-order";
  /** Limited run: the badge and the "left" bar */
  stock?: { left: number; total: number };
  options?: ProductOption[];
  signed?: boolean;
  soldOut?: boolean;
  /** Sent as a download link by e-mail, so it needs no delivery */
  digital?: boolean;
  /** One or two lines under the price */
  summary: string;
  /** maib requires a detailed description of every product: what it is, sizes, materials, what's included */
  description: string[];
  specs: Array<[label: string, value: string]>;
  tracklist?: string[];
  packaging: string;
};

const FRAME_OPTION: ProductOption = {
  id: "frame",
  label: "Frame",
  values: [
    { id: "black", label: "Black frame", color: "#0b0714" },
    { id: "white", label: "White frame", color: "#f4f0ff" },
    { id: "grey", label: "Grey frame", color: "#9a8fb3" },
  ],
};

const POSTER_OPTION: ProductOption = {
  id: "frame",
  label: "Frame",
  values: [
    { id: "unframed", label: "Unframed" },
    { id: "framed", label: "Framed" },
  ],
};

const TRACKLIST = Array.from({ length: 8 }, (_, i) => `[TRACK ${i + 1}] — [ARTIST]`);

const PRINT_SPECS: ShopProduct["specs"] = [
  ["Size", "[W × H] cm"],
  ["Print", "[PRINT TYPE], [PAPER]"],
  ["Frame", "[MATERIAL], glass, ready to hang"],
  ["Edition", "[N] signed and numbered copies"],
];

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: "vinyl-lp",
    name: "Vinyl LP — [ARTIST / ALBUM]",
    shortName: "Vinyl LP",
    subtitle: "Festival edition 2027",
    price: "[PRICE]",
    amount: null,
    category: "vinyl",
    visual: "vinyl",
    featured: true,
    stock: { left: 102, total: 300 },
    options: [
      {
        id: "edition",
        label: "Edition",
        values: [
          { id: "black", label: "Black vinyl", color: "#111111" },
          { id: "white", label: "White vinyl", color: "#ffffff" },
          { id: "grey", label: "Grey marbled", color: "#9a9a9a" },
        ],
      },
      {
        id: "format",
        label: "Format",
        values: [
          { id: "1lp", label: "1×LP" },
          { id: "2lp", label: "2×LP" },
          { id: "signed", label: "Signed" },
        ],
      },
    ],
    summary: "[Short description: the album, who plays on it and what makes the festival edition special.]",
    description: [
      "[What the record is: artist, album, year, label.]",
      "[What is in the sleeve: inner sleeve, insert, download code.]",
    ],
    specs: [
      ["Format", "12″ LP, 33⅓ rpm, 180 g"],
      ["Sleeve", "[SLEEVE TYPE]"],
      ["Edition", "300 numbered copies"],
    ],
    tracklist: TRACKLIST,
    packaging: "New and sealed. Shipped in a rigid mailer with corner protection.",
  },
  {
    id: "framed-print-1",
    name: "Framed print — [ARTWORK 1]",
    shortName: "Framed print 1",
    subtitle: "[ARTIST], 2027",
    price: "[PRICE]",
    amount: null,
    category: "art",
    visual: "print",
    badge: "New",
    options: [FRAME_OPTION],
    summary: "[Short description of the artwork and the artist.]",
    description: ["[About the artwork: idea, technique, the artist.]", "[What is included: certificate of authenticity.]"],
    specs: PRINT_SPECS,
    packaging: "Wrapped in protective film and shipped in a reinforced box.",
  },
  {
    id: "framed-print-2",
    name: "Framed print — [ARTWORK 2]",
    shortName: "Framed print 2",
    subtitle: "[ARTIST], 2027",
    price: "[PRICE]",
    amount: null,
    category: "art",
    visual: "print",
    options: [FRAME_OPTION],
    summary: "[Short description of the artwork and the artist.]",
    description: ["[About the artwork: idea, technique, the artist.]", "[What is included: certificate of authenticity.]"],
    specs: PRINT_SPECS,
    packaging: "Wrapped in protective film and shipped in a reinforced box.",
  },
  {
    id: "poster-line-up",
    name: "Poster — Line-up 2027 (A2)",
    shortName: "Poster A2 · Line-up",
    price: "[PRICE]",
    amount: null,
    category: "posters",
    visual: "poster",
    badge: "Pre-order",
    options: [POSTER_OPTION],
    summary: "The official line-up poster. Pre-order: ships [DATE].",
    description: ["[About the poster: design, artist, print run.]"],
    specs: [
      ["Size", "A2, 42 × 59.4 cm"],
      ["Paper", "[PAPER], [WEIGHT] g/m²"],
      ["Frame", "Unframed, or in a [MATERIAL] frame"],
    ],
    packaging: "Unframed posters are rolled in a tube; framed ones ship in a reinforced box.",
  },
  {
    id: "poster-signed",
    name: "Poster (A2, signed)",
    shortName: "Poster A2 · Signed",
    price: "[PRICE]",
    amount: null,
    category: "posters",
    visual: "poster",
    signed: true,
    soldOut: true,
    summary: "The line-up poster signed by [ARTISTS].",
    description: ["[About the poster and the signatures.]"],
    specs: [
      ["Size", "A2, 42 × 59.4 cm"],
      ["Paper", "[PAPER], [WEIGHT] g/m²"],
    ],
    packaging: "Rolled in a tube.",
  },
  {
    id: "vinyl-compilation",
    name: "Vinyl LP — Festival compilation",
    shortName: "Vinyl · Compilation",
    subtitle: "Black Out Fest 2027",
    price: "[PRICE]",
    amount: null,
    category: "vinyl",
    visual: "vinyl",
    summary: "[Short description: the artists of the festival on one record.]",
    description: ["[What is on the record and who compiled it.]"],
    specs: [
      ["Format", "12″ LP, 33⅓ rpm"],
      ["Sleeve", "[SLEEVE TYPE]"],
    ],
    tracklist: TRACKLIST,
    packaging: "New and sealed. Shipped in a rigid mailer with corner protection.",
  },
  {
    id: "poster-artist",
    name: "Poster — [ARTIST] (A3)",
    shortName: "Poster A3",
    price: "[PRICE]",
    amount: null,
    category: "posters",
    visual: "poster",
    options: [POSTER_OPTION],
    summary: "[Short description of the poster.]",
    description: ["[About the poster: design, artist, print run.]"],
    specs: [
      ["Size", "A3, 29.7 × 42 cm"],
      ["Paper", "[PAPER], [WEIGHT] g/m²"],
    ],
    packaging: "Unframed posters are rolled in a tube; framed ones ship in a reinforced box.",
  },
  {
    id: "e-journal-1",
    name: "E-journal · Issue #1 (PDF)",
    shortName: "E-journal #1",
    price: "[PRICE]",
    amount: null,
    category: "e-journal",
    visual: "journal",
    digital: true,
    summary: "The festival e-journal: interviews, photos and the story behind Black Out Fest.",
    description: ["[What is inside: articles, interviews, number of pages.]"],
    specs: [
      ["Format", "PDF, [N] pages"],
      ["Language", "[LANGUAGE]"],
      ["Delivery", "Download link by e-mail after payment"],
    ],
    packaging: "Digital product: nothing is shipped.",
  },
];

/** Ticket + poster + vinyl bundle, shown at the end of the full list */
export const FESTIVAL_PACK = {
  items: ["Ticket", "Poster", "Vinyl"],
  oldPrice: "[PRICE]",
  price: "[PRICE]",
  saving: "Save 20%",
  number: "№ 0027",
};

export const MAX_PER_PRODUCT = 10;

export type DeliveryMethod = {
  id: "pickup" | "courier" | "moldova";
  name: string;
  note: string;
  /** Shown on the product page */
  time: string;
  price: string;
  /** In CURRENCY; null until the real prices are set */
  amount: number | null;
  /** Courier delivery needs the address */
  address: boolean;
};

export const DELIVERY_METHODS: DeliveryMethod[] = [
  { id: "pickup", name: "Pick up at the festival", note: "Pick-up point at the entrance · show your order QR", time: "", price: "Free", amount: 0, address: false },
  { id: "courier", name: "Courier in Chișinău", note: "1–2 working days", time: "1–2 days", price: "[PRICE]", amount: null, address: true },
  { id: "moldova", name: "Delivery across Moldova", note: "Poșta Moldovei / courier · 2–4 working days", time: "2–4 days", price: "[PRICE]", amount: null, address: true },
];

export function productById(id: string): ShopProduct | undefined {
  return SHOP_PRODUCTS.find((p) => p.id === id);
}

/** First value of every option, e.g. { edition: "black", format: "1lp" } */
export function defaultOptions(product: ShopProduct): Record<string, string> {
  return Object.fromEntries((product.options ?? []).map((option) => [option.id, option.values[0].id]));
}

/** "Black vinyl · 1×LP" */
export function optionsLabel(product: ShopProduct, picked: Record<string, string>): string {
  return (product.options ?? [])
    .map((option) => option.values.find((v) => v.id === picked[option.id])?.label)
    .filter(Boolean)
    .join(" · ");
}
