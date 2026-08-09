# Portfolio Site — Design Spec

**Date:** 2026-08-09
**Owner:** Mahmood Ahmad Sajjad (independent AI engineer)
**Goal:** A lead-generation portfolio that positions the owner for AI-engineering
client work. Sharp value prop → services → real projects as proof → credibility →
book-a-call.

## Decisions (locked with the user)

- **Primary goal:** Win client work.
- **Projects featured:** 3 AI flagships only — `catalogiq`, `nexguard`,
  `jarvis-for-ahmad`. Personal/"love" sites and coursework excluded.
- **Project sync:** Curated manifest + live build-time enrichment + a GitHub
  Action that opens a PR for newly detected public repos (approval gate).
- **Contact CTA:** Booking link (placeholder until provided) + email fallback.
- **Aesthetic:** Dark technical / precise, single **electric-cyan** accent.
- **Motion:** Both anime.js v4 (showpieces) and Motion (component reactivity).

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · anime.js v4 · Motion ·
Vitest · deployed on Vercel with hourly ISR for live GitHub metadata.

## Architecture

### Data / project pipeline
- `content/projects.json` — source of truth for featured projects + curated
  case-study copy (problem / solution / outcome / role / highlights / stack).
- `content/registry.json` — GitHub owner + `ignored` repos (never surfaced).
- `lib/projects.ts` — validates the manifest (throws at build on malformed data),
  merges curated data with live metadata.
- `lib/github.ts` — fetches live GitHub metadata with ISR; **returns null on any
  failure so the page falls back to curated data (never breaks).**
- `lib/sync.mjs` — pure `selectNewRepos` / `stubFromRepo` helpers, shared by the
  detection script and the test suite.
- `scripts/detect-new-projects.mjs` + `.github/workflows/sync-projects.yml` —
  daily/on-demand detection of new public repos; opens a PR with a pre-filled
  stub. Merge to publish, close to skip.

### Pages / sections
- `/` — Nav, Hero, Services, Work (live projects), About, Contact, Footer.
- `/work/[slug]` — per-project case study (statically generated, ISR-refreshed).
- `sitemap.ts`, `robots.ts`, dynamic `opengraph-image.tsx`, `not-found.tsx`.

### Motion split
- **anime.js v4:** hero entrance timeline (staggered headline, SVG line-draw,
  node pop + ambient pulse), scroll-triggered count-ups. Lazy-loaded.
- **Motion (`motion/react`):** scroll reveals, card hover springs, animated
  mobile menu. `prefers-reduced-motion` honored throughout.

## Quality
- Vitest unit tests for validation, GitHub merge + fallback, and sync filtering.
- Type-safe, ESLint-clean, accessible (focus states, reduced-motion, no-JS reveal
  fallback via `<noscript>`).

## Open items (placeholders, non-blocking)
- Booking URL, X handle, real project outcome metrics, custom domain.
