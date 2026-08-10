"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * A soft cyan→blue aurora that eases toward the pointer, so the color theme
 * is felt as ambient light across the dark surfaces. Sits behind content.
 */
export function CursorAura() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight * 0.28;
    let cx = tx;
    let cy = ty;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      el.style.setProperty("--mx", `${cx}px`);
      el.style.setProperty("--my", `${cy}px`);
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        mixBlendMode: "screen",
        background: reduce
          ? "radial-gradient(600px circle at 50% 18%, rgba(76,134,255,0.10), transparent 60%)"
          : "radial-gradient(560px circle at var(--mx,50%) var(--my,28%), rgba(45,224,212,0.12), rgba(76,134,255,0.07) 42%, transparent 64%)",
      }}
    />
  );
}
