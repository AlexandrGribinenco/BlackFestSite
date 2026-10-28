import type { MetadataRoute } from "next";
import { LEGAL_DOCS } from "@/lib/legal";
import { SHOP_PRODUCTS } from "@/lib/shop";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

// Every public page; the cart and the checkout are left out (robots.ts keeps them out of search too)
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Array<[path: string, priority: number]> = [
    ["/", 1],
    ["/tickets", 0.9],
    ["/info", 0.8],
    ["/shop", 0.8],
    ["/gallery", 0.7],
    ["/bar-restaurant", 0.6],
    ["/hotels", 0.6],
    ["/partners", 0.5],
    ["/contacts", 0.5],
    ...SHOP_PRODUCTS.map((product) => [`/shop/${product.id}`, 0.6] as [string, number]),
    ...LEGAL_DOCS.map((doc) => [`/legal/${doc.slug}`, 0.2] as [string, number]),
  ];
  const lastModified = new Date();
  return pages.map(([path, priority]) => ({ url: absoluteUrl(path), lastModified, priority }));
}
