"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useWebGL } from "@/components/three/useWebGL";
import { Container } from "@/components/ui/Container";

const VehicleScene = dynamic(() => import("@/components/three/Vehicle"), { ssr: false });

/**
 * Scroll-driven 3D showcase: the vehicle orbits as the reader scrolls through a
 * tall section with a sticky canvas. The 3D scene mounts only when the section
 * is near the viewport (perf), and falls back to a static silhouette otherwise.
 */
export function Showcase({ vehicleSrc }: { vehicleSrc: string | null }) {
  const { enabled } = useWebGL();
  const sectionRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      progress.current = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Only mount the WebGL scene when the section is close to view.
    const io = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: "60% 0px 60% 0px" },
    );
    io.observe(el);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <section id="showcase" ref={sectionRef} className="relative h-[240vh]">
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        {enabled && near ? (
          <div className="absolute inset-0">
            <VehicleScene progress={progress} vehicleSrc={vehicleSrc} />
          </div>
        ) : (
          <VehicleFallback />
        )}

        <div className="pointer-events-none relative w-full">
          <Container>
            <div className="max-w-md">
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-signal">
                The Machine
              </span>
              <h2 className="font-display mt-4 pb-1 text-balance text-4xl font-bold leading-[1.16] tracking-[-0.02em] text-foreground sm:text-5xl">
                Built like everything I ship.
              </h2>
              <p className="mt-4 max-w-sm leading-relaxed text-muted">
                Purpose-built, nothing wasted, every part earning its place. The
                same obsession goes into the systems I put into production.
              </p>
              <span className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
                <span className="animate-breathe">↓</span> scroll to orbit
              </span>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}

/** Static angular silhouette for no-WebGL / reduced-motion. */
function VehicleFallback() {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center opacity-70">
      <svg viewBox="0 0 400 160" className="h-auto w-[70%] max-w-2xl text-steel">
        <defs>
          <linearGradient id="veh" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a1f27" />
            <stop offset="1" stopColor="#0b0d11" />
          </linearGradient>
        </defs>
        <path
          d="M20 110 L70 108 L110 78 L180 70 L250 74 L300 70 L360 92 L384 108 L384 118 L20 118 Z"
          fill="url(#veh)"
          stroke="#3a4756"
          strokeWidth="1.5"
        />
        <circle cx="110" cy="120" r="22" fill="#05060a" stroke="#3a4756" strokeWidth="2" />
        <circle cx="300" cy="120" r="22" fill="#05060a" stroke="#3a4756" strokeWidth="2" />
        <circle cx="110" cy="120" r="6" fill="#f2b43a" />
        <circle cx="300" cy="120" r="6" fill="#f2b43a" />
        <rect x="376" y="96" width="10" height="8" rx="2" fill="#f2b43a" />
      </svg>
    </div>
  );
}
