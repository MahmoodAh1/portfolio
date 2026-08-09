"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { site, hasBooking } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { Calendar, Close, Menu } from "@/components/ui/icons";

const ctaHref = hasBooking ? site.bookingUrl : "#contact";
const ctaLabel = hasBooking ? "Book a call" : "Get in touch";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5" aria-label={site.name}>
            <span className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface font-mono text-sm font-semibold text-accent transition-colors group-hover:border-accent/50">
              MA
            </span>
            <span className="hidden text-sm font-medium tracking-tight text-foreground sm:block">
              {site.name}
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-muted transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link
              href={ctaHref}
              {...(hasBooking ? { target: "_blank", rel: "noreferrer noopener" } : {})}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg shadow-[0_0_30px_-10px_var(--accent-glow)] transition-colors hover:bg-accent-bright"
            >
              <Calendar width={15} height={15} />
              {ctaLabel}
            </Link>
          </div>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-md border border-border text-foreground md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Close width={20} height={20} /> : <Menu width={20} height={20} />}
          </button>
        </nav>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            className="border-b border-border bg-bg/95 backdrop-blur-md md:hidden"
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Container>
              <div className="flex flex-col gap-1 py-4">
                {site.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-base text-muted transition-colors hover:bg-surface hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href={ctaHref}
                  {...(hasBooking ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-bg"
                >
                  <Calendar width={15} height={15} />
                  {ctaLabel}
                </Link>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
