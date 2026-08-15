import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Tilt3D } from "@/components/fx/Tilt3D";
import { skillGroups } from "@/content/skills";

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeading
        eyebrow="Skills"
        title="The Utility Belt"
        description="The tools I reach for, picked on purpose rather than by reflex. Every project uses the smallest set that does the job well."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group, i) => (
          <Reveal key={group.id} delay={i * 0.06}>
            <Tilt3D className="h-full">
              <div className="group panel relative h-full overflow-hidden rounded-xl p-6">
                <span aria-hidden className="signal-sweep" />
                <div className="relative">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-signal">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                      {group.label}
                    </h3>
                  </div>
                  <span
                    aria-hidden
                    className="mt-4 block h-px w-full bg-gradient-to-r from-edge/50 to-transparent"
                  />
                  <ul className="mt-5 flex flex-col gap-2.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-muted"
                      >
                        <span aria-hidden className="text-signal">
                          ▸
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Tilt3D>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
