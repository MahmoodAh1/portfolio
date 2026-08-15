"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import type { Project } from "@/lib/types";
import { Tag } from "@/components/ui/Tag";
import { ArrowUpRight, ExternalLink, Github, Star } from "@/components/ui/icons";
import { compactNumber, timeAgo } from "@/lib/format";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduce = useReducedMotion();
  const meta = project.github;
  const updated = timeAgo(meta?.pushedAt);

  // Magnetic tilt toward the pointer.
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 220, damping: 22 });
  const rotateY = useSpring(ry, { stiffness: 220, damping: 22 });

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 6);
    rx.set(-py * 6);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.article
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      className="panel group relative flex h-full flex-col rounded-xl p-6 sm:p-7"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: "0 0 80px -28px var(--signal-glow)" }}
      />

      <div className="relative flex items-center justify-between">
        <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          case file
          <span className="text-signal">{String(index + 1).padStart(2, "0")}</span>
        </span>
        <div className="flex items-center gap-2.5 text-faint">
          {meta && meta.stars > 0 && (
            <span className="inline-flex items-center gap-1 text-xs">
              <Star width={13} height={13} />
              {compactNumber(meta.stars)}
            </span>
          )}
          {project.liveUrl && (
            <span className="rounded border border-signal/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-signal">
              Live
            </span>
          )}
        </div>
      </div>

      <div className="relative mt-5">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
          {project.category}
        </span>
        <h3 className="font-display mt-2 text-xl font-semibold uppercase tracking-wide text-foreground">
          <Link href={`/work/${project.slug}`} className="relative z-20 after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{project.tagline}</p>
      </div>

      <ul className="relative mt-5 flex flex-wrap gap-2">
        {project.stack.slice(0, 5).map((s) => (
          <li key={s}>
            <Tag>{s}</Tag>
          </li>
        ))}
      </ul>

      <div className="relative mt-auto pt-6">
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-3 text-xs text-faint">
            {meta?.language && (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-signal" />
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
              className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted transition-colors hover:border-signal/50 hover:text-signal"
            >
              <Github width={15} height={15} />
            </a>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${project.title} live site`}
                className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted transition-colors hover:border-signal/50 hover:text-signal"
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
        className="pointer-events-none absolute right-6 top-6 text-faint opacity-0 transition-all duration-300 group-hover:text-signal group-hover:opacity-100"
      />
    </motion.article>
  );
}
