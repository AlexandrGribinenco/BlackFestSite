import type { MetadataRoute } from "next";
import { INDEXABLE, absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

// Until the launch nothing is indexed; then everything but the order pages and the API
export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/cart", "/checkout", "/api/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
