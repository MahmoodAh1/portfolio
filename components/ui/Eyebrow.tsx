import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Mono uppercase label with an accent tick — the recurring section marker. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-accent",
        className,
      )}
    >
      <span aria-hidden className="h-px w-6 bg-accent/60" />
      {children}
    </span>
  );
}
