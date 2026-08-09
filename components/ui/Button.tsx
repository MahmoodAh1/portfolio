import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-bg font-semibold hover:bg-accent-bright shadow-[0_0_34px_-10px_var(--accent-glow)] hover:shadow-[0_0_44px_-6px_var(--accent-glow)]",
  secondary:
    "border border-border bg-surface/60 text-foreground hover:border-accent/50 hover:text-accent",
  ghost: "text-muted hover:text-foreground",
};

export function Button({
  href,
  variant = "primary",
  external,
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const classes = cn(
    "group inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm transition-all duration-200",
    VARIANTS[variant],
    className,
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
