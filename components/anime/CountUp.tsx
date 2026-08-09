"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/** Counts up to `value` with anime.js when scrolled into view. */
export function CountUp({
  value,
  suffix = "",
  duration = 1600,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    // Reduced motion: skip the animation entirely (final value rendered below).
    if (reduce) return;
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let anim: any;
    let observer: IntersectionObserver | undefined;

    (async () => {
      const { animate } = await import("animejs");
      if (cancelled) return;

      const start = () => {
        const obj = { n: 0 };
        anim = animate(obj, {
          n: value,
          duration,
          ease: "outExpo",
          onUpdate: () => setDisplay(Math.round(obj.n)),
        });
      };

      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            start();
            observer?.disconnect();
          }
        },
        { threshold: 0.4 },
      );
      observer.observe(el);
    })();

    return () => {
      cancelled = true;
      anim?.revert?.();
      observer?.disconnect();
    };
  }, [value, duration, reduce]);

  const shown = reduce ? value : display;

  return (
    <span ref={ref}>
      {shown}
      {suffix}
    </span>
  );
}
