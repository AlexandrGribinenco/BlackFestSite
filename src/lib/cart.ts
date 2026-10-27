// Shop cart, kept in this browser's localStorage so it survives reloads and new tabs. Client components only.
// TODO: move it to the server together with the shop orders (stock, reservations)
import { useSyncExternalStore } from "react";
import { MAX_PER_PRODUCT, productById, type ShopProduct } from "./shop";

export type CartLine = {
  productId: string;
  /** Picked option values, e.g. { edition: "black", format: "1lp" } */
  options: Record<string, string>;
  qty: number;
};

const STORAGE_KEY = "bof-cart";
const EMPTY: CartLine[] = [];

let lines: CartLine[] | null = null;
const listeners = new Set<() => void>();

/** Same product with the same options is one line */
export function lineKey(line: Pick<CartLine, "productId" | "options">): string {
  const options = Object.keys(line.options)
    .sort()
    .map((key) => `${key}=${line.options[key]}`)
    .join("&");
  return `${line.productId}?${options}`;
}

// Drops lines of products that are no longer sold, e.g. after the catalog changes
function read(): CartLine[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(saved)) return EMPTY;
    return saved.filter(
      (line): line is CartLine =>
        typeof line?.productId === "string" &&
        Boolean(productById(line.productId)) &&
        typeof line.options === "object" &&
        Number.isInteger(line.qty) &&
        line.qty > 0,
    );
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): CartLine[] {
  lines ??= read();
  return lines;
}

function write(next: CartLine[]) {
  lines = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode or blocked storage: the cart still works until the page is reloaded
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab changed the cart
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    lines = read();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Cart lines; empty during the server render, filled in after hydration */
export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

export function cartCount(cart: CartLine[]): number {
  return cart.reduce((sum, line) => sum + line.qty, 0);
}

export function addToCart(productId: string, options: Record<string, string>, qty = 1) {
  const current = getSnapshot();
  const key = lineKey({ productId, options });
  const existing = current.find((line) => lineKey(line) === key);
  write(
    existing
      ? current.map((line) => (line === existing ? { ...line, qty: Math.min(line.qty + qty, MAX_PER_PRODUCT) } : line))
      : [...current, { productId, options, qty: Math.min(qty, MAX_PER_PRODUCT) }],
  );
}

/** 0 removes the line */
export function setLineQty(key: string, qty: number) {
  const current = getSnapshot();
  write(qty <= 0 ? current.filter((line) => lineKey(line) !== key) : current.map((line) => (lineKey(line) === key ? { ...line, qty } : line)));
}

export function clearCart() {
  write(EMPTY);
}

export type CartItem = { key: string; line: CartLine; product: ShopProduct };

/** Cart lines with their products */
export function cartItems(cart: CartLine[]): CartItem[] {
  return cart.flatMap((line) => {
    const product = productById(line.productId);
    return product ? [{ key: lineKey(line), line, product }] : [];
  });
}

/** Sum of the items in CURRENCY; null while any price is not set */
export function cartSubtotal(items: CartItem[]): number | null {
  let sum = 0;
  for (const { line, product } of items) {
    if (product.amount === null) return null;
    sum += product.amount * line.qty;
  }
  return Math.round(sum * 100) / 100;
}
