import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.role}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0b0d",
          backgroundImage:
            "radial-gradient(900px 460px at 82% -12%, rgba(242,180,58,0.18), transparent), radial-gradient(760px 420px at 12% 110%, rgba(58,71,86,0.24), transparent), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 56px 56px, 56px 56px",
          padding: "72px",
          color: "#e8eaed",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "12px",
              border: "1px solid #232a33",
              background: "#101216",
              color: "#f2b43a",
              fontSize: "30px",
              fontWeight: 700,
            }}
          >
            MA
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "22px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#f2b43a",
              fontFamily: "monospace",
            }}
          >
            {site.role} · Independent
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", fontSize: "72px", fontWeight: 700, lineHeight: 1.05, maxWidth: "1000px" }}>
            I build production AI systems that actually ship.
          </div>
          <div style={{ display: "flex", fontSize: "30px", color: "#9aa3ad", maxWidth: "900px" }}>
            {site.name} — agents, pipelines, and the software around them.
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", fontSize: "22px", color: "#5b636d", fontFamily: "monospace" }}>
          <span>Python</span>
          <span>·</span>
          <span>FastAPI</span>
          <span>·</span>
          <span>Next.js</span>
          <span>·</span>
          <span>LLMs</span>
          <span>·</span>
          <span>Agents</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
