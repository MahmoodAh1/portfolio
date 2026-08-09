"use client";

import { Fragment, useEffect } from "react";
import { useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Tag } from "@/components/ui/Tag";
import { HeroVisual } from "@/components/anime/HeroVisual";
import { site, hasBooking } from "@/content/site";
import { ArrowRight, ArrowUpRight, Calendar } from "@/components/ui/icons";

const LEAD = ["I", "build"];
const TAIL = ["that", "actually", "ship."];
const CHIPS = ["Python", "FastAPI", "Next.js", "React", "LLMs", "Agents"];

export function Hero() {
  const reduce = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let controls: any[] = [];

    (async () => {
      const { animate, createTimeline, stagger, svg, utils } = await import("animejs");
      if (cancelled) return;

      const animated = utils.$("[data-anim]");

      if (reduce) {
        utils.set(animated, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      const tl = createTimeline({ defaults: { ease: "outExpo", duration: 850 } });

      tl.add(".hero-eyebrow", { opacity: [0, 1], y: [12, 0], duration: 600 })
        .add(".hero-word", { opacity: [0, 1], y: [30, 0], delay: stagger(55) }, "-=250")
        .add(".hero-visual", { opacity: [0, 1], duration: 500 }, "-=500")
        .add(
          svg.createDrawable(".hero-draw"),
          { draw: ["0 0", "0 1"], duration: 1400, ease: "inOutQuad", delay: stagger(40) },
          "-=300",
        )
        .add(
          ".hero-node",
          { opacity: [0, 1], scale: [0, 1], ease: "outBack", duration: 650, delay: stagger(60) },
          "-=1100",
        )
        .add(".hero-sub", { opacity: [0, 1], y: [16, 0] }, "-=900")
        .add(".hero-cta", { opacity: [0, 1], y: [12, 0], delay: stagger(90) }, "-=700")
        .add(".hero-meta", { opacity: [0, 1], y: [10, 0] }, "-=600");

      const pulse = animate(".hero-node", {
        scale: [1, 1.35],
        opacity: [0.7, 1],
        loop: true,
        alternate: true,
        duration: 1900,
        delay: stagger(160),
        ease: "inOutSine",
        autoplay: false,
      });
      tl.then(() => {
        if (!cancelled) pulse.play();
      });

      controls = [tl, pulse];
    })();

    return () => {
      cancelled = true;
      controls.forEach((c) => c?.revert?.());
    };
  }, [reduce]);

  const primary = hasBooking
    ? { href: site.bookingUrl, label: "Book a call", external: true, icon: <Calendar width={16} height={16} /> }
    : { href: "#contact", label: "Get in touch", external: false, icon: <ArrowRight width={16} height={16} /> };

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <noscript>
        <style>{`[data-anim]{opacity:1 !important;transform:none !important;}`}</style>
      </noscript>

      {/* Backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-backdrop" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(34,211,238,0.16), transparent 70%)",
        }}
      />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span
              className="hero-eyebrow inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-accent"
              data-anim
              style={{ opacity: 0 }}
            >
              <span aria-hidden className="h-px w-6 bg-accent/60" />
              {site.role} · Independent
            </span>

            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {LEAD.map((w) => (
                <Fragment key={w}>
                  <span className="hero-word inline-block" data-anim style={{ opacity: 0 }}>
                    {w}
                  </span>{" "}
                </Fragment>
              ))}
              <span className="relative inline-block">
                <span
                  className="hero-word text-glow inline-block text-accent"
                  data-anim
                  style={{ opacity: 0 }}
                >
                  production AI systems
                </span>
                <svg
                  className="absolute -bottom-1 left-0 h-2 w-full overflow-visible"
                  viewBox="0 0 300 8"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    className="hero-draw"
                    d="M1 5 C 60 1, 240 1, 299 5"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              {TAIL.map((w) => (
                <Fragment key={w}>
                  <span className="hero-word inline-block" data-anim style={{ opacity: 0 }}>
                    {w}
                  </span>{" "}
                </Fragment>
              ))}
            </h1>

            <p
              className="hero-sub mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted"
              data-anim
              style={{ opacity: 0 }}
            >
              Agentic systems, data and content pipelines, and the full-stack
              software around them — designed, shipped, and maintained to a
              senior engineering bar.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <div className="hero-cta" data-anim style={{ opacity: 0 }}>
                <a
                  href={primary.href}
                  {...(primary.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  className="group inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-bg shadow-[0_0_34px_-10px_var(--accent-glow)] transition-all duration-200 hover:bg-accent-bright hover:shadow-[0_0_44px_-6px_var(--accent-glow)]"
                >
                  {primary.icon}
                  {primary.label}
                </a>
              </div>
              <div className="hero-cta" data-anim style={{ opacity: 0 }}>
                <a
                  href="#work"
                  className="group inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface/60 px-5 py-3 text-sm text-foreground transition-all duration-200 hover:border-accent/50 hover:text-accent"
                >
                  View work
                  <ArrowUpRight
                    width={16}
                    height={16}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            </div>

            <div
              className="hero-meta mt-10 flex flex-wrap items-center gap-x-5 gap-y-3"
              data-anim
              style={{ opacity: 0 }}
            >
              <span className="inline-flex items-center gap-2 text-sm text-muted">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ambient absolute inline-flex h-full w-full rounded-full bg-accent" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Available for select client work
              </span>
              <span aria-hidden className="hidden h-4 w-px bg-border sm:block" />
              <div className="flex flex-wrap gap-2">
                {CHIPS.map((c) => (
                  <Tag key={c}>{c}</Tag>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none">
            <HeroVisual />
          </div>
        </div>
      </Container>
    </section>
  );
}
