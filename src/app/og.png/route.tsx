// GET /og.png — the share preview of every page (Open Graph and X cards, lib/site.ts OG_IMAGE), drawn at build time
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { EVENT } from "@/lib/event";

export const dynamic = "force-static";

export async function GET() {
  const [regular, bold] = await Promise.all([
    readFile(path.join(process.cwd(), "public/fonts/Inter-Regular.ttf")),
    readFile(path.join(process.cwd(), "public/fonts/Inter-Bold.ttf")),
  ]);
  // Until the date and the venue are known, the card says what can be done now
  const when = [EVENT.date, EVENT.venue].some((value) => value.includes("[")) ? "Tickets on sale now" : `${EVENT.date} · ${EVENT.venue}`;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 72,
        background: "#0b0714",
        backgroundImage:
          "radial-gradient(circle at 86% 18%, rgba(138, 63, 252, 0.55), rgba(11, 7, 20, 0) 50%), radial-gradient(circle at 64% 100%, rgba(255, 46, 147, 0.3), rgba(11, 7, 20, 0) 45%)",
        color: "#f4f0ff",
        fontFamily: "Inter",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", color: "#ff2e93", fontSize: 26, fontWeight: 700, letterSpacing: 4 }}>MUSIC · ART · CULTURE</div>
        {/* The eclipse of the site icon */}
        <div style={{ position: "relative", display: "flex", width: 96, height: 96 }}>
          <div style={{ display: "flex", boxSizing: "border-box", width: 84, height: 84, marginTop: 12, border: "12px solid #8a3ffc", borderRadius: "50%" }} />
          <div style={{ position: "absolute", top: 0, right: 0, display: "flex", width: 26, height: 26, borderRadius: "50%", background: "#ff2e93" }} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", fontSize: 128, fontWeight: 700, lineHeight: 1, letterSpacing: -3 }}>
        <span>BLACK OUT</span>
        <span>FEST 2027</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", color: "#9a8fb3", fontSize: 30 }}>
        <span>{when}</span>
        <span>by View Bar</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
