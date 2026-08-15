"use client";

import { useReducedMotion } from "motion/react";
import { Tilt3D } from "./Tilt3D";

/**
 * The hero portrait: shown big and complete the moment the page opens, graded to
 * sit inside the Gotham palette (cool shadows, a warm amber wash, and a soft
 * fade so the figure emerges from the dark rather than sitting in a hard box).
 * Floats and tilts in 3D over an amber backlight.
 *
 * `needsCutout` is true when using the raw GitHub avatar (shown framed); when a
 * user drops a transparent `public/me.png`, it is shown unframed as a cutout.
 */
export function Portrait3D({
  src,
  needsCutout,
}: {
  src: string;
  needsCutout: boolean;
}) {
  const reduce = useReducedMotion();
  const framed = needsCutout;

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
      {/* amber backlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div
          className="h-4/5 w-4/5 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(closest-side, rgba(242,180,58,0.32), transparent 72%)",
          }}
        />
      </div>

      <Tilt3D max={8} className="w-full">
        <div className={reduce ? "w-full" : "w-full animate-portrait-float"}>
          <div
            className={`relative w-full overflow-hidden ${
              framed
                ? "rounded-[1.4rem] ring-1 ring-white/10 shadow-[0_34px_70px_-24px_rgba(0,0,0,0.75)]"
                : ""
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt="Mahmood Ahmad Sajjad"
              className="block h-auto w-full"
              style={{
                filter: framed
                  ? "contrast(1.08) saturate(0.95) brightness(1.03)"
                  : "contrast(1.06) saturate(1) brightness(1.02) drop-shadow(0 30px 50px rgba(0,0,0,0.62))",
              }}
            />

            {framed && (
              <>
                {/* theme duotone wash: cool shadows, warm amber highlights */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(155deg, rgba(58,71,86,0.28), transparent 45%, rgba(242,180,58,0.20))",
                    mixBlendMode: "soft-light",
                  }}
                />
                {/* fade the base into the page so the figure emerges from the dark */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                  style={{ background: "linear-gradient(to top, #0a0b0d, transparent)" }}
                />
                {/* soft vignette */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{ boxShadow: "inset 0 0 90px rgba(0,0,0,0.55)" }}
                />
              </>
            )}
          </div>
        </div>
      </Tilt3D>
    </div>
  );
}
