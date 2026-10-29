import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentResult } from "@/components/checkout/PaymentResult";
import "../checkout.css";

// Return page after the maib checkout page (successUrl / failUrl). No Figma frame: it reuses the D3 "Payment successful!"
// and D8 "Payment failed" blocks.

export const metadata: Metadata = {
  title: "Payment — Black Out Fest 2027",
  robots: { index: false },
};

export default function PaymentResultPage() {
  return (
    <Suspense>
      <PaymentResult />
    </Suspense>
  );
}
