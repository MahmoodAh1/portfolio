import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { Tilt3D } from "@/components/fx/Tilt3D";
import { services } from "@/content/services";

export function Services() {
  return (
    <Section id="services" className="border-t border-border/60">
      <SectionHeading
        eyebrow="Services"
        title="What I Deploy"
        description="Four ways I help teams get AI and software into production — with the discipline of someone who's shipped and maintained it."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {services.map((service, i) => (
          <Reveal key={service.id} delay={i * 0.05} className="h-full">
            <Tilt3D max={6} className="h-full">
              <div className="group panel relative flex h-full flex-col overflow-hidden rounded-xl p-7">
                <span aria-hidden className="signal-sweep" />
                <div className="relative flex items-center gap-3">
                  <span className="font-mono text-sm font-semibold text-signal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className="h-px flex-1 bg-gradient-to-r from-edge/50 to-transparent transition-colors duration-300 group-hover:from-signal/60"
                  />
                </div>
                <h3 className="font-display relative mt-5 text-lg font-semibold uppercase tracking-wide text-foreground">
                  {service.title}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-muted">
                  {service.summary}
                </p>
                <ul className="relative mt-6 flex flex-wrap gap-2">
                  {service.points.map((p) => (
                    <li key={p}>
                      <Tag>{p}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
            </Tilt3D>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
