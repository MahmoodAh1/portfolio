"use client";

import { Scramble } from "@/components/fx/Scramble";
import { cn } from "@/lib/cn";

/** Mono, uppercase, decoding label — the recurring technical section marker. */
export function Eyebrow({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.24em] text-accent",
        className,
      )}
    >
      <span aria-hidden className="h-px w-7 bg-gradient-to-r from-accent to-transparent" />
      <Scramble text={children} />
    </span>
  );
}
