import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import "./checkout.css";

// Figma: Desktop / D3 · Checkout (steps 1–5) 2:518, Mobile / M4.1–M4.5
// Lives outside the (site) group: checkout has its own header and no site footer.

export const metadata: Metadata = {
  title: "Checkout — Black Out Fest 2027",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutFlow />
    </Suspense>
  );
}
