"use client";

import { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Scramble } from "@/components/fx/Scramble";
import { RevealFallback } from "@/components/fx/RevealFallback";
import { useWebGL } from "@/components/three/useWebGL";
import { site, hasBooking } from "@/content/site";
import { ArrowRight, ArrowUpRight, Calendar } from "@/components/ui/icons";

// The WebGL cowl reveal is client-only and lazy; the CSS mask reveal is the fallback.
const HeroReveal = dynamic(() => import("@/components/three/HeroReveal"), {
  ssr: false,
});

const LEAD = ["I", "build"];
const TAIL = ["that", "actually", "ship."];

const STATS: [string, string][] = [
  ["response", "< 24h"],
  ["mode", "remote · worldwide"],
];

export function Hero({
  cowlSrc,
  portraitSrc,
}: {
  cowlSrc: string | null;
  portraitSrc: string;
}) {
  const reduce = useReducedMotion();
  const { enabled } = useWebGL();
  const [portraitError, setPortraitError] = useState(false);
  const use3D = enabled && !portraitError;

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let controls: any[] = [];

    (async () => {
      const { createTimeline, stagger, svg, utils } = await import("animejs");
      if (cancelled) return;

      const animated = utils.$(".hero-anim");
      if (reduce) {
        utils.set(animated, { opacity: 1, y: 0 });
        return;
      }

      const tl = createTimeline({ defaults: { ease: "outExpo", duration: 850 } });
      tl.add(".hero-eyebrow", { opacity: [0, 1], y: [12, 0], duration: 620 })
        .add(".hero-word", { opacity: [0, 1], y: [34, 0], delay: stagger(52) }, "-=260")
        .add(
          svg.createDrawable(".hero-underline"),
          { draw: ["0 0", "0 1"], duration: 1100, ease: "inOutQuad" },
          "-=350",
        )
        .add(".hero-sub", { opacity: [0, 1], y: [16, 0] }, "-=820")
        .add(".hero-cta", { opacity: [0, 1], y: [12, 0], delay: stagger(90) }, "-=700")
        .add(".hero-stat", { opacity: [0, 1], y: [10, 0], delay: stagger(70) }, "-=600");

      controls = [tl];
    })();

    return () => {
      cancelled = true;
      controls.forEach((c) => c?.revert?.());
    };
  }, [reduce]);

  const primary = hasBooking
    ? { href: site.bookingUrl, label: "Book a call", external: true, icon: <Calendar width={16} height={16} /> }
    : { href: "#contact", label: "Start a project", external: false, icon: <ArrowRight width={16} height={16} /> };

  return (
    <section id="reveal" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-backdrop" />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div
              className="hero-anim hero-eyebrow inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3.5 py-1.5 font-mono text-xs text-muted backdrop-blur"
              style={{ opacity: 0 }}
            >
              <span className="text-signal">◆</span>
              <Scramble text={`${site.role.toLowerCase().replace(/\s+/g, "-")} · Tarquen AI`} start="mount" />
            </div>

            <h1 className="font-display mt-6 text-balance text-[2.7rem] font-bold leading-[1.0] tracking-[-0.02em] text-foreground sm:text-6xl md:text-[4.3rem]">
              {LEAD.map((w) => (
                <Fragment key={w}>
                  <span className="hero-anim hero-word inline-block" style={{ opacity: 0 }}>
                    {w}
                  </span>{" "}
                </Fragment>
              ))}
              <span className="relative inline-block">
                <span className="hero-anim hero-word beam-text inline-block text-signal" style={{ opacity: 0 }}>
                  production AI systems
                </span>
                <svg
                  className="absolute -bottom-1.5 left-0 h-2.5 w-full overflow-visible"
                  viewBox="0 0 300 10"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    className="hero-underline"
                    d="M2 6 C 70 1, 230 1, 298 6"
                    fill="none"
                    stroke="#f2b43a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              {TAIL.map((w) => (
                <Fragment key={w}>
                  <span className="hero-anim hero-word inline-block" style={{ opacity: 0 }}>
                    {w}
                  </span>{" "}
                </Fragment>
              ))}
            </h1>

            <p
              className="hero-anim hero-sub mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted"
              style={{ opacity: 0 }}
            >
              Agentic systems, data and content pipelines, and the full-stack
              software around them — designed, shipped, and kept running to a
              senior engineering bar.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={primary.href}
                {...(primary.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                className="hero-anim hero-cta btn-signal inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold"
                style={{ opacity: 0 }}
              >
                {primary.icon}
                {primary.label}
              </a>
              <a
                href="#work"
                className="hero-anim hero-cta btn-ghost group inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm"
                style={{ opacity: 0 }}
              >
                View work
                <ArrowUpRight
                  width={16}
                  height={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs">
              <span
                className="hero-anim hero-stat inline-flex items-center gap-2 text-muted"
                style={{ opacity: 0 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-breathe absolute inline-flex h-full w-full rounded-full bg-signal" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
                </span>
                <span className="uppercase tracking-wider text-signal">available</span>
                <span className="text-faint">for new projects</span>
              </span>
              {STATS.map(([k, v]) => (
                <span
                  key={k}
                  className="hero-anim hero-stat inline-flex items-center gap-2 text-faint"
                  style={{ opacity: 0 }}
                >
                  <span className="uppercase tracking-wider">{k}</span>
                  <span className="text-muted">{v}</span>
                </span>
              ))}
            </div>
          </div>

          {/* The reveal — cowl over portrait, cursor is the bat-signal */}
          <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none">
            <div className="panel perspure relative h-full w-full overflow-hidden rounded-2xl">
              {use3D ? (
                <HeroReveal
                  portraitSrc={portraitSrc}
                  cowlSrc={cowlSrc}
                  onPortraitError={() => setPortraitError(true)}
                />
              ) : (
                <RevealFallback portraitSrc={portraitSrc} />
              )}

              {/* Dossier corner labels */}
              <div className="pointer-events-none absolute inset-0 p-4 font-mono text-[10px] uppercase tracking-widest text-faint">
                <span className="absolute left-4 top-4">subject</span>
                <span className="absolute right-4 top-4 text-signal">status: active</span>
                <span className="absolute bottom-4 left-4 text-muted">M. A. Sajjad</span>
                <span className="absolute bottom-4 right-4 animate-breathe">move to reveal</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
