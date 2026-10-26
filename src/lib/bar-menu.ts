// Bar & Restaurant menu (Figma: D13 "Menu grid" 347:6012, M12 menu 179:1150–179:1304)
// TODO: replace the placeholders with the real menu, prices in MDL

export type MenuTag = "hit" | "spicy" | "vegan" | "veg" | "18+";

export type MenuItem = {
  name: string;
  description: string;
  price: string;
  /** Weight or volume; missing where the wireframe shows none */
  portion?: string;
  tags?: MenuTag[];
};

export type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

export const MENU_TAGS: Record<MenuTag, { label: string; tone: "accent" | "violet" | "outline" }> = {
  hit: { label: "Hit", tone: "accent" },
  spicy: { label: "Spicy", tone: "accent" },
  vegan: { label: "Vegan", tone: "violet" },
  veg: { label: "Veg", tone: "violet" },
  "18+": { label: "18+", tone: "outline" },
};

/** Tags explained under the menu */
export const MENU_LEGEND: Array<{ tag: MenuTag; text: string }> = [
  { tag: "hit", text: "Best seller" },
  { tag: "vegan", text: "Vegan / vegetarian" },
  { tag: "18+", text: "Alcohol, ID required" },
];

const PRICE = "[PRICE]";
const WEIGHT = "[WEIGHT]";

export const MENU: MenuCategory[] = [
  {
    id: "food",
    name: "Food",
    items: [
      { name: "Black Out Burger", description: "Beef patty, cheddar, pickles, smoked sauce", price: PRICE, portion: WEIGHT, tags: ["hit"] },
      { name: "Grilled chicken wrap", description: "Chicken, vegetables, garlic sauce", price: PRICE, portion: WEIGHT },
      { name: "Vegan bowl", description: "Quinoa, roasted veggies, hummus", price: PRICE, portion: WEIGHT, tags: ["vegan"] },
      { name: "Fries", description: "Classic or sweet potato, choice of sauce", price: PRICE, portion: WEIGHT, tags: ["veg"] },
    ],
  },
  {
    id: "snacks",
    name: "Snacks",
    items: [
      { name: "Nachos", description: "Cheese sauce, jalapeño, salsa", price: PRICE, portion: WEIGHT, tags: ["spicy"] },
      { name: "Hot dog", description: "Grilled sausage, onion, mustard", price: PRICE, portion: WEIGHT },
      { name: "Popcorn", description: "Salted or caramel", price: PRICE, portion: WEIGHT, tags: ["veg"] },
    ],
  },
  {
    id: "cocktails",
    name: "Cocktails",
    items: [
      { name: "Black Out Signature", description: "House cocktail of the festival", price: PRICE, portion: WEIGHT, tags: ["18+"] },
      { name: "Aperol Spritz", description: "Aperol, prosecco, soda", price: PRICE, portion: WEIGHT, tags: ["18+"] },
      { name: "Mojito", description: "Rum, lime, mint", price: PRICE, portion: WEIGHT, tags: ["18+"] },
      { name: "Virgin Mojito", description: "Non-alcoholic", price: PRICE, portion: WEIGHT },
    ],
  },
  {
    id: "beer-wine",
    name: "Beer & Wine",
    items: [
      { name: "Draft beer 0.5 l", description: "Local lager", price: PRICE, tags: ["18+"] },
      { name: "Craft IPA 0.5 l", description: "Moldovan craft brewery", price: PRICE, tags: ["18+"] },
      { name: "House wine", description: "Red / white / rosé, glass 150 ml", price: PRICE, tags: ["18+"] },
    ],
  },
  {
    id: "soft-drinks",
    name: "Soft drinks & coffee",
    items: [
      { name: "Homemade lemonade", description: "Classic, berry or mint", price: PRICE },
      { name: "Water 0.5 l", description: "Still / sparkling", price: PRICE },
      { name: "Coffee", description: "Espresso, americano, cappuccino", price: PRICE, portion: WEIGHT },
    ],
  },
];
