"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Tilt3D } from "./Tilt3D";

/**
 * The portrait as a floating 3D cutout. When `needsCutout` is set (using the
 * GitHub avatar), the background is removed in-browser and the result is shown
 * as a transparent cutout with depth, tilt, a soft float, and an amber
 * backlight. While removal is in flight (or if it fails) the raw image is shown
 * behind a soft radial mask so it never reads as a hard box.
 */
export function Portrait3D({
  src,
  needsCutout,
}: {
  src: string;
  needsCutout: boolean;
}) {
  const reduce = useReducedMotion();
  const [cut, setCut] = useState<string | null>(null);

  useEffect(() => {
    if (!needsCutout) return;
    let url: string | null = null;
    let cancelled = false;
    (async () => {
      try {
        const { removeBackground } = await import("@imgly/background-removal");
        const blob = await removeBackground(src);
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setCut(url);
      } catch {
        // Keep the raw image (masked) if removal fails.
      }
    })();
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [src, needsCutout]);

  const img = cut ?? src;
  const hasCut = Boolean(cut) || !needsCutout;

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-sm lg:max-w-md">
      {/* amber backlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div
          className="h-4/5 w-4/5 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(closest-side, rgba(242,180,58,0.30), transparent 72%)",
          }}
        />
      </div>

      <Tilt3D max={9} className="h-full w-full">
        <div className={reduce ? "h-full w-full" : "h-full w-full animate-portrait-float"}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt="Mahmood Ahmad Sajjad"
            className="h-full w-full object-contain object-bottom"
            style={
              hasCut
                ? { filter: "drop-shadow(0 26px 40px rgba(0,0,0,0.6))" }
                : {
                    WebkitMaskImage:
                      "radial-gradient(circle at 50% 42%, #000 54%, transparent 78%)",
                    maskImage:
                      "radial-gradient(circle at 50% 42%, #000 54%, transparent 78%)",
                  }
            }
          />
        </div>
      </Tilt3D>
    </div>
  );
}
