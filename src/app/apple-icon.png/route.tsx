// GET /apple-icon.png — home screen icon on iPhones, linked in the root layout. A plain route rather than the
// apple-icon file convention: the static export would save that one without an extension and without the base path.
// The eclipse of public/icon.svg, scaled from its 64 × 64 grid (temporary, until the logo arrives).
import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", background: "#0b0714" }}>
      <div style={{ display: "flex", boxSizing: "border-box", width: 118, height: 118, border: "17px solid #8a3ffc", borderRadius: "50%" }} />
      <div style={{ position: "absolute", top: 40, left: 112, display: "flex", width: 28, height: 28, borderRadius: "50%", background: "#ff2e93" }} />
    </div>,
    { width: 180, height: 180 },
  );
}
