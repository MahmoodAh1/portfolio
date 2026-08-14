# Batman-themed 3D Portfolio — Design Spec

**Date:** 2026-08-14
**Owner:** Mahmood Ahmad Sajjad (independent AI engineer)
**Goal:** Full visual + structural redesign of the portfolio into a Batman /
Dark-Knight-inspired, fully-3D experience whose job is to win client work. Keep
all existing infrastructure (real GitHub-backed projects, PR-sync automation,
solo authorship, tests, deploy pipeline).

## 1. Direction & constraints (decided)

- **Mood:** "Dark Knight cinematic" — near-black Gotham, cold gunmetal steel-blue,
  cold white searchlight, one restrained warm amber "bat-signal" accent.
- **Everything 3D:** the site must *read* as fully three-dimensional. Real WebGL
  (React Three Fiber) for the showpieces; CSS-3D depth/tilt/parallax on every
  section and card. Text stays in the DOM for SEO/accessibility — the page is
  never a single un-indexable canvas.
- **Real DC assets, user-provided:** the site prefers real DC files if present at
  known public paths. We do **not** fetch or recreate DC's copyrighted
  logo/cowl artwork. Until the user drops real files in, an **original stylized
  bat silhouette** (a generic bat shape, not the DC emblem) stands in so nothing
  looks broken. Real assets take over automatically when added.
- **Hero photo:** pull the user's GitHub avatar (`github.com/MahmoodAh1`), framed
  as a contained portrait so ~400px stays crisp. A hi-res `public/me.jpg` is
  preferred automatically if present.
- **Sections, in order:** Hero (reveal) → Skills → Services → Projects → Contact.
- **Retired:** the cyan "Signal/Control Plane" palette, the constellation
  `HeroScene`, and the `SignalMesh` 2D fallback are replaced.

## 2. Design tokens

```
--bg      #0a0b0d   near-black Gotham
--surface #101216   elevated panels
--ink     #e8eaed   cold white (primary text)
--muted   #9aa3ad   secondary text
--faint   #5b636d   tertiary / captions
--steel   #3a4756   gunmetal structural fills
--edge    #6b7787   cold hairline borders
--beam    #dfe7f2   searchlight (cold white-blue)
--signal  #f2b43a   bat-signal amber — ONE warm accent, used sparingly
```

Type: a chiselled/architectural display face for headers (candidates: Oswald,
Archivo, or a condensed grotesque) + JetBrains Mono for telemetry/labels. Final
face chosen at build; must ship via `next/font` (no external CDN).

## 3. Architecture

### 3.1 3D strategy (how "everything 3D" stays fast + indexable)

- **One persistent `<Canvas>`** mounted fixed behind all content: the Gotham
  atmosphere layer (fog, drifting particulate, a slow volumetric bat-signal beam
  sweeping the sky, faint rain, city-depth parallax). Client-only, lazy, and
  gated on WebGL support + `prefers-reduced-motion`.
- **Hero showpiece** lives in that same canvas (or a dedicated hero canvas): the
  cowl/bat silhouette in 3D with the avatar plane behind it and a pointer-driven
  spotlight reveal.
- **DOM content** (all text, links, cards) sits in a `z`-layer above the canvas,
  given depth with **CSS 3D transforms + Motion** — perspective containers,
  `rotateX/Y` tilt on hover, translateZ parallax on scroll.
- **Progressive enhancement:** no-WebGL or reduced-motion → flat static render
  with the atmosphere as a CSS gradient/still; no-JS → `<noscript>` reveals all
  content (reuse the existing global override).

### 3.2 Asset resolution

A small helper resolves each themed asset to the user's real file if present,
else the drawn fallback:

- `public/bat-logo.svg`  → emblem (nav mark, contact signal). Fallback: drawn SVG bat.
- `public/cowl.png` or `.glb` → hero cowl. Fallback: drawn cowl silhouette / extruded SVG.
- `public/me.jpg` → hero portrait. Fallback: GitHub avatar.

Resolution is build-time where possible (file existence check) with a safe
runtime default. No broken images at any point.

### 3.3 Components

```
components/
  three/
    GothamAtmosphere.tsx   persistent fog + bat-signal beam + rain + city depth
    HeroReveal.tsx         3D cowl + avatar plane + pointer spotlight reveal
    useWebGL.ts            WebGL support + reduced-motion gate (shared hook)
  fx/
    Tilt3D.tsx             reusable CSS-3D perspective/tilt wrapper (hover + gyro)
    SignalSweep.tsx        amber bat-signal spotlight sweep for section accents
  sections/
    Hero.tsx               name, tagline, CTAs, telemetry + mounts HeroReveal
    Skills.tsx             "Utility Belt" capability grid (NEW)
    Services.tsx           "What I Deploy" — reuse content/services.ts, re-skin
    Work.tsx               "Case Files" — real GitHub projects, re-skin
    Contact.tsx            "Light the Signal" — email + booking slot + socials
  ui/ ...                  Container, icons, Reveal (updated for Gotham depth)
lib/
  assets.ts                real-DC-asset-or-fallback resolver (NEW)
content/
  skills.ts                capability groups for the Utility Belt (NEW)
  services.ts              unchanged
  projects.json            unchanged
  registry.json            unchanged
  site.ts                  unchanged (X handle already present)
```

## 4. Sections

### 4.1 Hero — "The Reveal"
Gotham-night backdrop (atmosphere canvas). Large display name, role eyebrow,
tagline, two CTAs (Start a project / View work), telemetry stats row.
Centerpiece: **3D cowl/bat silhouette** with the avatar plane behind it; a
**cold-white spotlight follows the cursor**, revealing the face only inside the
beam. Touch: beam auto-sweeps in a slow arc; tap-drag repositions it.
Reduced-motion: soft static reveal, no chasing light.

### 4.2 Skills — "The Utility Belt"
Capabilities grouped as belt "gadgets": **AI & Agents** (LLM orchestration, RAG,
evals, guardrails, structured outputs) · **Full-stack** (Next.js, React, TS,
Tailwind, MERN) · **Backend & Data** (FastAPI, Python, pipelines, queues/cron) ·
**Ship & Infra** (Vercel, Railway/Render, CI/CD, GitHub Actions). Steel-bordered
3D-tilt cards; amber spotlight sweep on hover. Data in `content/skills.ts`.

### 4.3 Services — "What I Deploy"
Reuse the four entries in `content/services.ts` verbatim, re-skinned as 3D
dossier cards with depth + tilt.

### 4.4 Projects — "Case Files"
**Unchanged data + automation.** The 3 real GitHub-backed flagships, live repo
metadata (`lib/github.ts`), and the PR-sync Action all stay. Re-skinned as
detective "case files": dossier cards with 3D parallax, stamped status, and the
existing magnetic tilt upgraded to true perspective.

### 4.5 Contact — "Light the Signal"
Bat-signal projected into fog as the CTA moment (amber, the one warm accent).
Email + booking-link slot (`site.bookingUrl`, still optional) + socials
(GitHub, Hugging Face, X @Ahmadtechai). Reuses `activeSocials` / `hasBooking`.

## 5. Motion system
- **anime.js v4** — hero text timeline, SVG draw accents, staggers.
- **Motion v13** — scroll-triggered reveals with 3D unfold (`rotateX`), tilt springs.
- **R3F/Three** — atmosphere + hero reveal; `useFrame` loops, pointer parallax.
- Honor `prefers-reduced-motion` everywhere; all loops cancel on unmount.

## 6. Accessibility & fallbacks
- Text is real DOM — screen-reader and SEO friendly.
- `prefers-reduced-motion`: static reveal, no beams/rain, no auto-motion.
- No WebGL: CSS-gradient Gotham backdrop, flat (non-canvas) hero portrait reveal
  on hover via CSS mask.
- No JS: existing global `<noscript>` override forces all opacity-0 content visible.
- Color contrast: cold white on near-black clears WCAG AA for body text.

## 7. Out of scope (YAGNI)
- No CMS, no auth, no backend service — static + ISR as today.
- No real DC asset fetching/generation — user supplies files.
- No audio.

## 8. Success criteria
- Reads unmistakably as a premium Batman/Dark-Knight site, fully 3D in feel.
- The hero cursor-spotlight reveal works on desktop + touch, degrades cleanly.
- All existing tests pass; `next build` + lint clean; no-JS/reduced-motion OK.
- Real GitHub projects + PR-sync automation still function.
- Commits solo-authored; deploys to Vercel as today.
