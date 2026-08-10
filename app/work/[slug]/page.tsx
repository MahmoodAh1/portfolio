import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/github";
import { loadCuratedProjects } from "@/lib/projects";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { ArrowLeft, ArrowUpRight, ExternalLink, Github, Star } from "@/components/ui/icons";
import { compactNumber, timeAgo } from "@/lib/format";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return loadCuratedProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  const title = `${project.title} — ${project.category}`;
  const description = `${project.tagline} ${project.problem}`.slice(0, 200);
  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{label}</h2>
      <div className="mt-3 text-pretty leading-relaxed text-muted">{children}</div>
    </div>
  );
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const meta = project.github;
  const updated = timeAgo(meta?.pushedAt);

  return (
    <>
      <Nav />
      <main className="flex-1">
        <article className="relative pt-32 pb-20 sm:pt-40">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 grid-backdrop" />

          <Container>
            <Reveal>
              <Link
                href="/#work"
                className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
              >
                <ArrowLeft
                  width={15}
                  height={15}
                  className="transition-transform duration-200 group-hover:-translate-x-0.5"
                />
                All work
              </Link>
            </Reveal>

            <div className="mt-8 max-w-3xl">
              <Reveal>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                  {project.category}
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  {project.title}
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
                  {project.tagline}
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm text-foreground transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    <Github width={15} height={15} />
                    View source
                  </a>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm text-foreground transition-colors hover:border-accent/50 hover:text-accent"
                    >
                      <ExternalLink width={15} height={15} />
                      Live
                    </a>
                  )}
                  <div className="flex items-center gap-4 text-xs text-faint">
                    {meta && meta.stars > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <Star width={13} height={13} />
                        {compactNumber(meta.stars)}
                      </span>
                    )}
                    {meta?.language && (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-accent" />
                        {meta.language}
                      </span>
                    )}
                    {updated && <span>Updated {updated}</span>}
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="mt-16 grid gap-12 lg:grid-cols-[1.6fr_0.9fr]">
              <div className="space-y-10">
                <Reveal>
                  <Block label="The problem">
                    <p>{project.problem}</p>
                  </Block>
                </Reveal>
                <Reveal>
                  <Block label="What I built">
                    <p>{project.solution}</p>
                  </Block>
                </Reveal>
                <Reveal>
                  <Block label="Outcome">
                    <p>{project.outcome}</p>
                  </Block>
                </Reveal>
                <Reveal>
                  <Block label="Highlights">
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {project.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5 text-sm text-muted">
                          <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </Block>
                </Reveal>
              </div>

              <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
                <Reveal>
                  <div className="rounded-xl border border-border bg-surface p-6">
                    <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Role</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{project.role}</p>
                  </div>
                </Reveal>
                <Reveal>
                  <div className="rounded-xl border border-border bg-surface p-6">
                    <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Stack</h2>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {project.stack.map((s) => (
                        <li key={s}>
                          <Tag>{s}</Tag>
                        </li>
                      ))}
                    </ul>
                    {meta && meta.languages.length > 0 && (
                      <>
                        <h3 className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
                          Languages (live)
                        </h3>
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {meta.languages.map((l) => (
                            <li key={l}>
                              <Tag>{l}</Tag>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </Reveal>
              </aside>
            </div>

            <Reveal>
              <div className="mt-20 flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-surface p-8 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Want something like this shipped?
                  </h2>
                  <p className="mt-2 text-sm text-muted">
                    Let&apos;s talk about what you&apos;re building.
                  </p>
                </div>
                <Link
                  href="/#contact"
                  className="btn-grad inline-flex shrink-0 items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold"
                >
                  Get in touch
                  <ArrowUpRight width={16} height={16} />
                </Link>
              </div>
            </Reveal>
          </Container>
        </article>
      </main>
      <Footer />
    </>
  );
}
