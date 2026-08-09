import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { services } from "@/content/services";

export function Services() {
  return (
    <Section id="services" className="border-t border-border/60">
      <SectionHeading
        eyebrow="Services"
        title="What I build for clients"
        description="Four ways I help teams get AI and software into production — with the discipline of someone who's shipped and maintained it."
      />

      <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
        {services.map((service, i) => (
          <Reveal key={service.id} delay={i * 0.05} className="h-full">
            <div className="group flex h-full flex-col bg-surface p-7 transition-colors duration-300 hover:bg-surface-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden className="h-px flex-1 bg-border" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{service.summary}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {service.points.map((p) => (
                  <li key={p}>
                    <Tag>{p}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
