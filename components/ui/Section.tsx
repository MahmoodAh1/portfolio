import type { ReactNode } from "react";
import { Container } from "./Container";
import { cn } from "@/lib/cn";

export function Section({
  id,
  className,
  containerClassName,
  children,
}: {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24 py-20 sm:py-28", className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
