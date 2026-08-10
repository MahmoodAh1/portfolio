"use client";

import { Fragment, useEffect } from "react";
import { useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Scramble } from "@/components/fx/Scramble";
import { SignalMesh } from "@/components/fx/SignalMesh";
import { site, hasBooking } from "@/content/site";
import { ArrowRight, ArrowUpRight, Calendar } from "@/components/ui/icons";

const LEAD = ["I", "build"];
const TAIL = ["that", "actually", "ship."];

const STATS: [string, string][] = [
  ["status", "available"],
  ["response", "< 24h"],
  ["mode", "remote · worldwide"],
];

export function Hero() {
  const reduce = useReducedMotion();

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
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Backdrop: grid + dual aurora for color presence */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-backdrop" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 -z-10 h-[460px] w-[560px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(45,224,212,0.16), transparent 72%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-40 -z-10 h-[520px] w-[620px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(155,140,255,0.16), transparent 72%)" }}
      />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div
              className="hero-anim hero-eyebrow inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3.5 py-1.5 font-mono text-xs text-muted backdrop-blur"
              style={{ opacity: 0 }}
            >
              <span className="text-accent">›</span>
              <Scramble text={`${site.role.toLowerCase().replace(/\s+/g, "-")} · independent`} start="mount" />
            </div>

            <h1 className="font-display mt-6 text-balance text-[2.6rem] font-semibold leading-[1.04] tracking-tight text-foreground sm:text-6xl md:text-[4.2rem]">
              {LEAD.map((w) => (
                <Fragment key={w}>
                  <span className="hero-anim hero-word inline-block" style={{ opacity: 0 }}>
                    {w}
                  </span>{" "}
                </Fragment>
              ))}
              <span className="relative inline-block">
                <span className="hero-anim hero-word text-gradient inline-block" style={{ opacity: 0 }}>
                  production AI systems
                </span>
                <svg
                  className="absolute -bottom-1.5 left-0 h-2.5 w-full overflow-visible"
                  viewBox="0 0 300 10"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <defs>
                    <linearGradient id="hero-underline-grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#2de0d4" />
                      <stop offset="0.55" stopColor="#4c86ff" />
                      <stop offset="1" stopColor="#9b8cff" />
                    </linearGradient>
                  </defs>
                  <path
                    className="hero-underline"
                    d="M2 6 C 70 1, 230 1, 298 6"
                    fill="none"
                    stroke="url(#hero-underline-grad)"
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
              software around them — designed, shipped, and maintained to a
              senior engineering bar.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={primary.href}
                {...(primary.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                className="hero-anim hero-cta btn-grad inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold shadow-[0_0_40px_-12px_var(--accent-glow)] transition-shadow duration-200 hover:shadow-[0_0_48px_-8px_var(--accent-glow)]"
                style={{ opacity: 0 }}
              >
                {primary.icon}
                {primary.label}
              </a>
              <a
                href="#work"
                className="hero-anim hero-cta grad-border group inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface/60 px-5 py-3 text-sm text-foreground transition-colors duration-200 hover:text-accent"
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
                  <span className="animate-breathe absolute inline-flex h-full w-full rounded-full bg-accent" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                <span className="uppercase tracking-wider text-accent">available</span>
                <span className="text-faint">for select client work</span>
              </span>
              {STATS.slice(1).map(([k, v]) => (
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

          <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none">
            <SignalMesh />
          </div>
        </div>
      </Container>
    </section>
  );
}
