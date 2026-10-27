import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopCheckout } from "@/components/cart/ShopCheckout";
import "../../checkout/checkout.css";
import "./cart.css";

// Figma: Desktop / D12 · Cart + shop checkout 347:141, Mobile / M11 · Cart + checkout 3:12334.
// Unlike the ticket checkout it keeps the site header and footer, as in the wireframe; it reuses the checkout styles
// (steps, order summary, forms, mobile bar).

export const metadata: Metadata = {
  title: "Cart — Black Out Fest 2027",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <Suspense>
      <ShopCheckout />
    </Suspense>
  );
}
