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
          background: "#060709",
          backgroundImage:
            "radial-gradient(1000px 500px at 80% -10%, rgba(34,211,238,0.20), transparent), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "auto, 56px 56px, 56px 56px",
          padding: "72px",
          color: "#e6ebf2",
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
              border: "1px solid #1b2130",
              background: "#0b0d11",
              color: "#22d3ee",
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
              color: "#22d3ee",
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
          <div style={{ display: "flex", fontSize: "30px", color: "#99a3b4", maxWidth: "900px" }}>
            {site.name} — agents, pipelines, and the software around them.
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", fontSize: "22px", color: "#626b7d", fontFamily: "monospace" }}>
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
