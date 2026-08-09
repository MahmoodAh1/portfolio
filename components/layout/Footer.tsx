import { site, activeSocials } from "@/content/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/40">
      <Container>
        <div className="flex flex-col gap-8 py-12 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface font-mono text-sm font-semibold text-accent">
                MA
              </span>
              <span className="text-sm font-medium text-foreground">{site.name}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">{site.description}</p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
              Elsewhere
            </span>
            <div className="flex flex-col gap-2">
              {activeSocials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  {s.label}
                  {s.handle ? <span className="text-faint"> · @{s.handle}</span> : null}
                </a>
              ))}
              <a
                href={`mailto:${site.email}`}
                className="text-sm text-muted transition-colors hover:text-accent"
              >
                Email
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border py-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="font-mono">
            Built with Next.js · anime.js · Motion
          </p>
        </div>
      </Container>
    </footer>
  );
}
