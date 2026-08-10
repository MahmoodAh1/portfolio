import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="font-display mt-5 text-balance text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-4xl md:text-[2.75rem]">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.12}>
          <p className="mt-4 text-pretty leading-relaxed text-muted">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
