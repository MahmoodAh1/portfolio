# Portfolio — Mahmood Ahmad Sajjad

A dark, technical portfolio site that positions an independent AI engineer for
client work. Built with **Next.js 16 (App Router) + TypeScript + Tailwind v4**,
animated with **anime.js v4** (orchestrated showpieces) and **Motion** (scroll
reveals, gestures, transitions). Deployed on **Vercel**.

## Sections

Hero → Services → Selected work (live from GitHub) → About → Contact.
Each flagship project also has a `/work/[slug]` case-study page.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run test       # Vitest (data layer: validation, merge/fallback, sync filter)
npm run lint       # ESLint
```

## Editing content

Everything you'd tweak lives in `content/`:

| File | What it controls |
| --- | --- |
| `content/site.ts` | Name, role, value prop, **email**, **booking link**, socials, nav |
| `content/services.ts` | The Services section |
| `content/projects.json` | Featured projects (source of truth) + curated case-study copy |
| `content/registry.json` | GitHub owner + repos to never surface (`ignored`) |

### Placeholders to fill in

- **Booking link** — set `bookingUrl` in `content/site.ts` to your Cal.com /
  Calendly URL. Until then the primary CTA falls back to email (no broken links).
- **X/Twitter handle** — fill the `X` entry in `site.socials` (empty entries are
  hidden automatically).
- **Case-study outcomes** — each project in `content/projects.json` has an
  `outcome: "TODO: ..."` — replace with a real metric when you have one.

## How new GitHub projects reach the site

Projects are **curated**, not auto-published. The flow:

1. `content/projects.json` is the source of truth for what's featured.
2. `lib/github.ts` enriches each entry with **live** GitHub metadata (stars,
   language, topics, last push) at build time, revalidated hourly (ISR). If the
   GitHub API is unavailable, it falls back to curated data — the page never breaks.
3. `.github/workflows/sync-projects.yml` runs **daily** (and on demand) and calls
   `scripts/detect-new-projects.mjs`. When you push a **new public repo**, it adds
   a stub entry and **opens a pull request** proposing it. **Merge to publish,
   close to skip.** That PR is the "ask me first" gate.

Run it manually right after pushing a new repo:
GitHub → **Actions** → *Sync GitHub projects* → **Run workflow**
(or locally: `npm run sync:projects`).

> One-time repo setting: **Settings → Actions → General → Workflow permissions**
> → enable *"Allow GitHub Actions to create and approve pull requests."*

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `GITHUB_TOKEN` | Optional | Read-only GitHub PAT. Raises the API rate limit from 60/hr to 5000/hr for live project metadata. The site works without it. Set it in `.env.local` and in the Vercel project. |

## Animation split

- **anime.js v4** — hero entrance timeline, SVG line-draw, node pulse, count-ups.
  Lazy-loaded in the client, skipped under `prefers-reduced-motion`.
- **Motion** — scroll reveals, card hover springs, animated mobile menu.

## Deploy

Push to GitHub and import into Vercel (framework auto-detected). Add
`GITHUB_TOKEN` in the Vercel project's Environment Variables (optional). Update
`site.url` in `content/site.ts` once the domain is known.
