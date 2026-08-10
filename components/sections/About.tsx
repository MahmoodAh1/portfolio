import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/anime/CountUp";
import { site } from "@/content/site";

const STATS: { value: number; suffix?: string; label: string }[] = [
  { value: 3, label: "Production AI systems" },
  { value: 4, label: "Service areas" },
  { value: 10, suffix: "+", label: "Technologies shipped" },
];

const PRINCIPLES: { title: string; body: string }[] = [
  { title: "Architecture before code", body: "Structure, data flow, and interfaces get sketched and agreed before a single file is generated." },
  { title: "Production-grade by default", body: "Error handling, validation, env-based config, logging, and tests — even on a fast MVP." },
  { title: "Structured AI, with guardrails", body: "Schema-valid outputs, input/output validation, cost and latency ceilings, and defined fallbacks." },
  { title: "Evaluate before shipping", body: "A lightweight eval set for prompt and agent behavior — not \"it worked once.\"" },
  { title: "Observable & maintainable", body: "Agent decisions and tool calls are logged and debuggable. Written for a stranger to read." },
];

export function About() {
  return (
    <Section id="about" className="border-t border-border/60">
      <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <SectionHeading eyebrow="About" title="Senior engineering, applied to AI." />

          <div className="mt-6 space-y-4 leading-relaxed text-muted">
            <Reveal>
              <p>
                I&apos;m {site.name}  As an AI engineer at Tarquen AI,I design and ship
                production AI systems: agents, data and content pipelines, and the
                full-stack software that surrounds them.
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p>
                My bar is simple: build like a senior engineer.Deliberate model
                selection, schema-validated outputs, guardrails and evals, with cost
                and latency treated as first-class constraints, not an afterthought
                bolted on once it &quot;works once.&quot;
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                I work across the stack — Python / FastAPI services and AI
                orchestration, Next.js / MERN front ends  and take projects from
                architecture through to a deployed, monitored, maintainable system.
              </p>
            </Reveal>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {STATS.map((s) => (
              <Reveal key={s.label} className="grad-border rounded-lg bg-surface p-4">
                <div className="text-gradient font-mono text-3xl font-semibold">
                  <CountUp value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1.5 text-xs leading-snug text-muted">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="lg:pt-2">
          <Reveal>
            <div className="grad-border rounded-xl bg-surface p-7 sm:p-8">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                How I work
              </h3>
              <ul className="mt-6 divide-y divide-border">
                {PRINCIPLES.map((p, i) => (
                  <li key={p.title} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <span className="mt-0.5 font-mono text-xs text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-foreground">{p.title}</div>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{p.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
