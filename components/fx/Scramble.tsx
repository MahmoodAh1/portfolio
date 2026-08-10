"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>#*·";

/**
 * Terminal-style decode: the text resolves out of scrambling glyphs.
 * Runs once when scrolled into view (or immediately with start="mount").
 */
export function Scramble({
  text,
  className,
  start = "view",
  duration = 850,
}: {
  text: string;
  className?: string;
  start?: "view" | "mount";
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    let raf = 0;
    let startT = 0;
    let observer: IntersectionObserver | undefined;

    const tick = (t: number) => {
      if (!startT) startT = t;
      const p = Math.min((t - startT) / duration, 1);
      const revealed = Math.floor(p * text.length);
      let out = text.slice(0, revealed);
      for (let i = revealed; i < text.length; i++) {
        out += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setDisplay(out);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisplay(text);
    };

    const begin = () => {
      raf = requestAnimationFrame(tick);
    };

    if (start === "mount" || !el) {
      begin();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            begin();
            observer?.disconnect();
          }
        },
        { threshold: 0.6 },
      );
      observer.observe(el);
    }

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [text, duration, start, reduce]);

  const shown = reduce ? text : display || " ";

  return (
    <span ref={ref} className={className}>
      {shown}
    </span>
  );
}
