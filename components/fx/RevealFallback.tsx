"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { BatMark } from "./BatMark";

/**
 * No-WebGL / reduced-motion / loading fallback for the hero reveal.
 * A dark cover with the bat emblem sits over the portrait; a CSS mask punches a
 * soft hole that follows the pointer (auto-sweeps when idle). Reduced-motion
 * renders a static soft reveal.
 */
export function RevealFallback({ portraitSrc }: { portraitSrc: string }) {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const lastMove = useRef(0);

  useEffect(() => {
    if (reduce) return;
    const el = root.current;
    const cv = cover.current;
    if (!el || !cv) return;

    let raf = 0;
    const setPos = (x: number, y: number) => {
      cv.style.setProperty("--mx", `${x}%`);
      cv.style.setProperty("--my", `${y}%`);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      lastMove.current = performance.now();
      setPos(Math.max(0, Math.min(100, x)), Math.max(0, Math.min(100, y)));
    };
    el.addEventListener("pointermove", onMove);

    const loop = () => {
      const now = performance.now();
      if (now - lastMove.current > 2500) {
        const t = now / 1000;
        setPos(50 + Math.sin(t * 0.6) * 30, 42 + Math.sin(t * 0.9) * 22);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  const mask = reduce
    ? "radial-gradient(circle at 50% 42%, transparent 0%, transparent 46%, #000 78%)"
    : "radial-gradient(circle 120px at var(--mx, 50%) var(--my, 42%), transparent 0%, transparent 34%, #000 62%)";

  return (
    <div ref={root} className="relative h-full w-full overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={portraitSrc}
        alt="Mahmood Ahmad Sajjad"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        ref={cover}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: "#0c0e12",
          WebkitMaskImage: mask,
          maskImage: mask,
        }}
      >
        <BatMark
          className="w-2/3 text-[#b9c3d1]"
          title="Batman"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 120px rgba(0,0,0,0.65)" }}
      />
    </div>
  );
}
