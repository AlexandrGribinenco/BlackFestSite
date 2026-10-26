// Links to other sites (partners, hotels) open in a new tab.
// Placeholder links ("#") stay in the same tab until the real URLs are known.
export function externalLinkProps(url: string) {
  return url.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
