"use client";

import dynamic from "next/dynamic";
import { useWebGL } from "./useWebGL";

const GothamAtmosphere = dynamic(() => import("./GothamAtmosphere"), {
  ssr: false,
});

/**
 * Fixed Gotham backdrop behind all content. Renders the 3D atmosphere where
 * WebGL is supported and motion is allowed; otherwise a static CSS Gotham
 * gradient (near-black with a faint distant bat-signal glow).
 */
export default function AtmosphereMount() {
  const { enabled } = useWebGL();

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      {/* Always-present CSS Gotham base (also the no-WebGL / reduced-motion look) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 72% -10%, rgba(242,180,58,0.10), transparent 42%), radial-gradient(100% 80% at 50% 120%, rgba(58,71,86,0.20), transparent 60%), #0a0b0d",
        }}
      />
      {enabled && (
        <div className="absolute inset-0">
          <GothamAtmosphere />
        </div>
      )}
    </div>
  );
}
