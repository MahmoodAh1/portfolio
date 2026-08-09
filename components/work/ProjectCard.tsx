"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { Project } from "@/lib/types";
import { Tag } from "@/components/ui/Tag";
import { ArrowUpRight, ExternalLink, Github, Star } from "@/components/ui/icons";
import { compactNumber, timeAgo } from "@/lib/format";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduce = useReducedMotion();
  const meta = project.github;
  const updated = timeAgo(meta?.pushedAt);

  return (
    <motion.article
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex h-full flex-col rounded-xl border border-border bg-surface p-6 transition-colors duration-300 hover:border-accent/40 sm:p-7"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: "0 0 70px -24px var(--accent-glow)" }}
      />

      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-faint">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-2.5 text-faint">
          {meta && meta.stars > 0 && (
            <span className="inline-flex items-center gap-1 text-xs">
              <Star width={13} height={13} />
              {compactNumber(meta.stars)}
            </span>
          )}
          {project.liveUrl && (
            <span className="rounded border border-accent/30 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
              Live
            </span>
          )}
        </div>
      </div>

      <div className="mt-5">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
          {project.category}
        </span>
        <h3 className="mt-2 text-xl font-semibold text-foreground">
          <Link href={`/work/${project.slug}`} className="relative z-20 after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{project.tagline}</p>
      </div>

      <ul className="mt-5 flex flex-wrap gap-2">
        {project.stack.slice(0, 5).map((s) => (
          <li key={s}>
            <Tag>{s}</Tag>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-3 text-xs text-faint">
            {meta?.language && (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent" />
                {meta.language}
              </span>
            )}
            {updated && <span>Updated {updated}</span>}
          </div>
          <div className="relative z-30 flex items-center gap-2">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${project.title} on GitHub`}
              className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted transition-colors hover:border-accent/50 hover:text-accent"
            >
              <Github width={15} height={15} />
            </a>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${project.title} live site`}
                className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted transition-colors hover:border-accent/50 hover:text-accent"
              >
                <ExternalLink width={15} height={15} />
              </a>
            )}
          </div>
        </div>
      </div>

      <ArrowUpRight
        width={18}
        height={18}
        className="pointer-events-none absolute right-6 top-6 text-faint opacity-0 transition-all duration-300 group-hover:text-accent group-hover:opacity-100"
      />
    </motion.article>
  );
}
