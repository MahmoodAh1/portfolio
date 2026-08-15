import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { BatMark } from "@/components/fx/BatMark";
import { ArrowUpRight, Calendar, Mail } from "@/components/ui/icons";
import { site, hasBooking, activeSocials } from "@/content/site";

export function Contact() {
  return (
    <Section id="contact" className="border-t border-border/60">
      <Reveal>
        <div className="panel relative overflow-hidden rounded-2xl p-8 sm:p-12">
          {/* Projected bat-signal */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-14 opacity-[0.14]"
            style={{ filter: "drop-shadow(0 0 30px rgba(242,180,58,0.5))" }}
          >
            <BatMark className="h-64 w-64 text-signal" />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl"
            style={{ background: "radial-gradient(closest-side, rgba(242,180,58,0.16), transparent 70%)" }}
          />

          <div className="relative max-w-2xl">
            <Eyebrow>Contact</Eyebrow>
            <h2 className="font-display mt-4 text-balance text-3xl font-semibold uppercase tracking-tight text-foreground sm:text-4xl">
              Light the signal.
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted">
              Tell me what you&apos;re building. I&apos;ll come back with the smallest,
              most reliable way to get it into production and what it&apos;ll cost in
              time and latency.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {hasBooking ? (
                <>
                  <a
                    href={site.bookingUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn-signal inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold"
                  >
                    <Calendar width={16} height={16} />
                    Book a call
                  </a>
                  <a
                    href={`mailto:${site.email}`}
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-3 text-sm text-foreground transition-colors hover:border-signal/50 hover:text-signal"
                  >
                    <Mail width={16} height={16} />
                    Email me
                  </a>
                </>
              ) : (
                <a
                  href={`mailto:${site.email}`}
                  className="btn-signal inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold"
                >
                  <Mail width={16} height={16} />
                  Email me
                </a>
              )}
              <CopyEmail email={site.email} />
            </div>

            {activeSocials.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-2">
                {activeSocials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-signal/50 hover:text-signal"
                  >
                    {s.label}
                    <ArrowUpRight
                      width={14}
                      height={14}
                      className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
