// Helpers for the payment API routes (app/api/payments).

/**
 * The site can be served from another origin than the API (the static test site on GitHub Pages calling a
 * separate server), so the browser needs CORS headers. PAYMENTS_ALLOWED_ORIGINS: comma-separated origins.
 */
export function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin");
  const allowed = (process.env.PAYMENTS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  if (!origin || !allowed.includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

export function json(request: Request, body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: corsHeaders(request) });
}

export function preflight(request: Request): Response {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

/** Buyer's IP for maib (required). Behind a proxy it comes from X-Forwarded-For. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "127.0.0.1";
}

/** Public URL of the site (where the buyer returns) and of this API (where maib sends the callback) */
export function urls() {
  const site = process.env.SITE_URL;
  const api = process.env.PAYMENTS_API_URL ?? site;
  if (!site || !api) throw new Error("SITE_URL is not set");
  return { site: site.replace(/\/$/, ""), api: api.replace(/\/$/, "") };
}
