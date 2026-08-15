import type { Project } from "@/lib/types";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/work/ProjectCard";
import { ArrowUpRight } from "@/components/ui/icons";
import { site } from "@/content/site";

export function Work({ projects }: { projects: Project[] }) {
  return (
    <Section id="work">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow="Selected work"
          title="Case Files"
          description="Real projects, pulled live from GitHub. Each one is built for production: models and pipelines with the software and observability around them."
        />
        <Reveal className="hidden sm:block">
          <a
            href={`https://github.com/${site.socials[0]?.handle ?? ""}`}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm text-muted transition-colors hover:text-signal"
          >
            All repositories
            <ArrowUpRight
              width={15}
              height={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.06} className="h-full">
            <ProjectCard project={project} index={i} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
