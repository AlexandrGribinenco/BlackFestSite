import type { NextConfig } from "next";

// Set by the GitHub Pages workflow: the site is exported as static files
// and served from a subfolder, e.g. /BlackFestSite
const pagesBasePath = process.env.PAGES_BASE_PATH;

const nextConfig: NextConfig =
  pagesBasePath === undefined
    ? {}
    : {
        output: "export",
        basePath: pagesBasePath,
        // Plain <img> and other public/ URLs don't get the base path automatically
        env: { NEXT_PUBLIC_BASE_PATH: pagesBasePath },
      };

export default nextConfig;
