# Batman-themed 3D Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as a Dark-Knight-cinematic, fully-3D experience across five sections (Hero reveal → Skills → Services → Projects → Contact) while keeping the real GitHub-backed projects, PR-sync automation, tests, and solo-authored deploy pipeline intact.

**Architecture:** One persistent React Three Fiber `<Canvas>` renders the Gotham atmosphere and the hero cowl+spotlight reveal; all text/cards stay in the DOM layered above it and get depth via CSS-3D transforms + Motion. Real DC assets are preferred at fixed `public/` paths and resolved at build; an original stylized bat silhouette stands in until the user supplies files. WebGL and motion are progressively enhanced — flat CSS fallbacks for no-WebGL / reduced-motion / no-JS.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind v4 (CSS `@theme`), anime.js v4, Motion v13, three 0.185 + @react-three/fiber 9, Vitest.

## Global Constraints

- Next.js 16.3.0 — read `node_modules/next/dist/docs/` before using unfamiliar APIs (per AGENTS.md).
- Tailwind v4 CSS-first: tokens live in `app/globals.css` `@theme`; no `tailwind.config.js`.
- Fonts via `next/font` only — no external CDN (CSP-safe).
- All commits solo-authored — never add a `Co-Authored-By` trailer. Conventional Commits.
- React lint: no `set-state-in-effect` (defer with rAF), no impurity in `useMemo`/render (no `Math.random`; use seeded PRNG).
- Every animation honors `prefers-reduced-motion`; every `useFrame`/timeline cancels on unmount.
- No real DC copyrighted binaries are fetched or generated — user-supplied only; original stylized bat silhouette is the fallback.
- Palette (exact): `--bg #0a0b0d`, `--surface #101216`, `--ink #e8eaed`, `--muted #9aa3ad`, `--faint #5b636d`, `--steel #3a4756`, `--edge #6b7787`, `--beam #dfe7f2`, `--signal #f2b43a`.

---

## Phase 0 — Foundation (tokens, fonts, pure logic)

### Task 0.1: Gotham palette + utilities in globals.css

**Files:**
- Modify: `app/globals.css` (replace the Signal/Control-Plane `@theme` block, gradient vars, and `.text-gradient`/`.bg-grad` utilities)

**Interfaces:**
- Produces CSS custom props + `@theme inline` mappings: colors above, plus `--font-display`, `--font-sans`, `--font-mono`.
- Produces utilities: `.text-signal` (amber), `.hairline` (1px `--edge` border), `.panel` (`--surface` + hairline + subtle inset), `.beam-text` (cold-white glow), `.grain` (existing noise, retuned darker), `.perspure` (`perspective: 1000px; transform-style: preserve-3d`).

- [ ] **Step 1:** Replace the `:root` color block with the exact palette tokens above; retune `body::before` grain opacity for near-black.
- [ ] **Step 2:** Replace `@theme inline` color mappings (`--color-bg`, `--color-surface`, `--color-ink`, `--color-muted`, `--color-faint`, `--color-steel`, `--color-edge`, `--color-beam`, `--color-signal`). Remove cyan/gradient theme entries.
- [ ] **Step 3:** Delete `.text-gradient`, `.bg-grad`, `.grad-border`, `.btn-grad` gradient sheen; add `.text-signal`, `.hairline`, `.panel`, `.beam-text`, `.perspure`, and a `.btn-signal` (amber-outlined CTA with soft glow). Keep `.marquee-track`, reduced-motion block.
- [ ] **Step 4:** Run `npm run build`. Expected: compiles (some class references in old components may break — those are fixed in later tasks; if build fails only on removed classes, note them and proceed, they are re-skinned below).
- [ ] **Step 5:** Commit: `git commit -am "feat: Gotham dark-knight palette and utilities"`

### Task 0.2: Fonts (chiselled display + mono)

**Files:**
- Modify: `app/layout.tsx` (swap `next/font` imports)

**Interfaces:**
- Produces CSS vars `--font-space-grotesk`→ replaced by `--font-display` source (Oswald or Archivo), `--font-manrope`→ body (Archivo/Inter), `--font-jetbrains` kept for mono. `@theme` in globals.css maps `--font-display/sans/mono` to these.

- [ ] **Step 1:** Import `Oswald` (display, weights 500/600) and `Archivo` (sans, 400/500/600) and keep `JetBrains_Mono` via `next/font/google`; expose `variable` CSS vars on `<body>`.
- [ ] **Step 2:** Update globals.css `@theme` `--font-display: var(--font-oswald)`, `--font-sans: var(--font-archivo)`, `--font-mono: var(--font-jetbrains)`.
- [ ] **Step 3:** Run `npm run build`. Expected: fonts resolve, compiles.
- [ ] **Step 4:** Commit: `git commit -am "feat: architectural display + sans fonts"`

### Task 0.3: Skills data model

**Files:**
- Create: `content/skills.ts`
- Test: `tests/skills.test.ts`

**Interfaces:**
- Produces: `export interface SkillGroup { id: string; label: string; items: string[] }` and `export const skillGroups: SkillGroup[]`.

- [ ] **Step 1: Write the failing test**
```ts
import { describe, it, expect } from "vitest";
import { skillGroups } from "@/content/skills";

describe("skillGroups", () => {
  it("has four non-empty groups with unique ids", () => {
    expect(skillGroups).toHaveLength(4);
    const ids = new Set(skillGroups.map((g) => g.id));
    expect(ids.size).toBe(4);
    for (const g of skillGroups) {
      expect(g.label.length).toBeGreaterThan(0);
      expect(g.items.length).toBeGreaterThanOrEqual(4);
    }
  });
});
```
- [ ] **Step 2: Run to verify it fails:** `npx vitest run tests/skills.test.ts` → FAIL (module not found).
- [ ] **Step 3: Implement** `content/skills.ts`:
```ts
/** Capability groups — drives the "Utility Belt" skills section. */
export interface SkillGroup { id: string; label: string; items: string[]; }

export const skillGroups: SkillGroup[] = [
  { id: "ai-agents", label: "AI & Agents",
    items: ["LLM orchestration", "RAG (when it earns it)", "Evals & guardrails", "Structured outputs", "Tool use"] },
  { id: "full-stack", label: "Full-stack",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "MERN"] },
  { id: "backend-data", label: "Backend & Data",
    items: ["FastAPI", "Python", "Data & content pipelines", "Queues / cron", "Postgres / Mongo"] },
  { id: "ship-infra", label: "Ship & Infra",
    items: ["Vercel", "Railway / Render", "CI/CD", "GitHub Actions", "Observability"] },
];
```
- [ ] **Step 4: Run:** `npx vitest run tests/skills.test.ts` → PASS.
- [ ] **Step 5: Commit:** `git commit -am "feat: skills data model for utility belt"`

### Task 0.4: Real-DC-asset resolver

**Files:**
- Create: `lib/assets.ts`
- Test: `tests/assets.test.ts`

**Interfaces:**
- Produces: `export function resolveAsset(kind: "logo" | "cowl" | "portrait"): string | null` — returns the public path (e.g. `/bat-logo.svg`) if a user-supplied file exists in `public/`, else `null` (caller uses the drawn fallback). Server-only (uses `fs`); call from server components and pass results as props.
- Produces: `export const AVATAR_URL` = GitHub avatar for `site` owner, `https://avatars.githubusercontent.com/MahmoodAh1?size=460`.
- Candidate map: logo→`["bat-logo.svg","bat-logo.png"]`, cowl→`["cowl.glb","cowl.png","cowl.svg"]`, portrait→`["me.jpg","me.png","me.webp"]`.

- [ ] **Step 1: Write the failing test** (tests pure candidate-resolution against a temp dir via an injectable base):
```ts
import { describe, it, expect } from "vitest";
import { firstExisting } from "@/lib/assets";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("firstExisting", () => {
  it("returns the first candidate that exists, else null", () => {
    const dir = mkdtempSync(join(tmpdir(), "assets-"));
    writeFileSync(join(dir, "cowl.png"), "x");
    expect(firstExisting(dir, ["cowl.glb", "cowl.png"])).toBe("cowl.png");
    expect(firstExisting(dir, ["nope.svg"])).toBeNull();
  });
});
```
- [ ] **Step 2: Run:** `npx vitest run tests/assets.test.ts` → FAIL.
- [ ] **Step 3: Implement** `lib/assets.ts`:
```ts
import { existsSync } from "node:fs";
import { join } from "node:path";

export function firstExisting(baseDir: string, candidates: string[]): string | null {
  for (const c of candidates) if (existsSync(join(baseDir, c))) return c;
  return null;
}

const PUBLIC = join(process.cwd(), "public");
const MAP = {
  logo: ["bat-logo.svg", "bat-logo.png"],
  cowl: ["cowl.glb", "cowl.png", "cowl.svg"],
  portrait: ["me.jpg", "me.png", "me.webp"],
} as const;

export function resolveAsset(kind: keyof typeof MAP): string | null {
  const found = firstExisting(PUBLIC, [...MAP[kind]]);
  return found ? `/${found}` : null;
}

export const AVATAR_URL = "https://avatars.githubusercontent.com/MahmoodAh1?size=460";
```
- [ ] **Step 4: Run:** `npx vitest run tests/assets.test.ts` → PASS.
- [ ] **Step 5:** Add `avatars.githubusercontent.com` to `next.config` `images.remotePatterns` (only if using `next/image`; R3F texture load is exempt). Commit: `git commit -am "feat: real-DC-asset resolver with drawn fallback"`

### Task 0.5: WebGL + reduced-motion gate hook

**Files:**
- Create: `components/three/useWebGL.ts`

**Interfaces:**
- Produces: `export function useWebGL(): { ready: boolean; enabled: boolean }` — `enabled` true only after mount when WebGL is supported AND reduced-motion is off; `ready` flips true after first rAF (avoids `set-state-in-effect` lint by deferring the `setState` inside `requestAnimationFrame`).

- [ ] **Step 1:** Implement using the proven deferred pattern (mirror current `Hero.tsx` detection): `useReducedMotion()` from `motion/react`; in `useEffect`, if reduced return; probe `canvas.getContext("webgl2"||"webgl")`; on success `requestAnimationFrame(() => setEnabled(true))`; cleanup cancels rAF.
- [ ] **Step 2:** Run `npm run lint`. Expected: no `set-state-in-effect` violation.
- [ ] **Step 3:** Commit: `git commit -am "feat: shared WebGL + reduced-motion gate hook"`

---

## Phase 1 — Gotham atmosphere (persistent 3D backdrop)

### Task 1.1: GothamAtmosphere canvas

**Files:**
- Create: `components/three/GothamAtmosphere.tsx`
- Create: `components/three/atmosphere-parts.tsx` (Fog particulate, RainStreaks, BatSignalBeam, CityDepth — kept in one file, each a small function component)

**Interfaces:**
- Consumes: nothing (self-contained).
- Produces: `export default function GothamAtmosphere()` — a fixed full-viewport client-only `<Canvas>` (`camera position [0,0,6] fov 55`, `dpr [1,1.75]`, `alpha`, `gl antialias`), `pointer-events-none`, `-z-10`. Contains: additive point-cloud fog drifting on `useFrame`; sparse vertical rain line-segments; a slow-sweeping volumetric cone (the bat-signal) tinted `--signal`, rotating ~0.05 rad/s; layered dim planes for city-depth parallax that respond to `pointer`.
- Determinism: all geometry uses a `seeded(i)` PRNG (`Math.sin(i*127.1+0.5)*43758.5453` frac), never `Math.random`.

- [ ] **Step 1:** Build `atmosphere-parts.tsx` with the four sub-components; fog as `<points>` with `AdditiveBlending` cold-white/steel colors, rain as `<lineSegments>`, beam as a `<mesh>` cone with `MeshBasicMaterial` transparent amber + additive, city as 2–3 dark `<mesh>` planes at increasing `z` depth.
- [ ] **Step 2:** Compose in `GothamAtmosphere.tsx`; wrap `useFrame` motions; no motion when a `reduced` prop/`useReducedMotion` is set (static frame).
- [ ] **Step 3:** Run `npm run build`. Expected: compiles.
- [ ] **Step 4:** Commit: `git commit -am "feat: 3D Gotham atmosphere (fog, rain, bat-signal beam, city depth)"`

### Task 1.2: Mount atmosphere globally with fallback

**Files:**
- Modify: `app/page.tsx` (mount a client wrapper behind `<main>`)
- Create: `components/three/AtmosphereMount.tsx` (client: uses `useWebGL`; renders `<GothamAtmosphere>` via `dynamic(ssr:false)` when `enabled`, else a CSS `.grain` + radial-gradient Gotham backdrop div)

**Interfaces:**
- Consumes: `useWebGL` (0.5), `GothamAtmosphere` (1.1).
- Produces: `export default function AtmosphereMount()` — fixed backdrop; no layout shift; `aria-hidden`.

- [ ] **Step 1:** Implement `AtmosphereMount`: `const { enabled } = useWebGL();` → 3D or CSS fallback (dark radial gradient `--bg`→`#05060a` + faint amber glow top-center for the distant signal).
- [ ] **Step 2:** Mount in `page.tsx` as the first child, fixed, `-z-10`.
- [ ] **Step 3:** Run `npm run build` + open `npm run dev`, verify backdrop renders and content sits above it. Expected: dark Gotham backdrop, no horizontal scroll.
- [ ] **Step 4:** Commit: `git commit -am "feat: mount Gotham atmosphere with CSS fallback"`

---

## Phase 2 — Hero "The Reveal"

### Task 2.1: HeroReveal — 3D cowl + avatar + pointer spotlight

**Files:**
- Create: `components/three/HeroReveal.tsx`
- Create: `components/three/BatSilhouette.tsx` (drawn original bat/cowl silhouette as an extruded shape or textured plane — the fallback when no `cowl` asset)

**Interfaces:**
- Consumes: `AVATAR_URL` and `resolveAsset("cowl"|"portrait")` result passed as props (`cowlSrc: string | null`, `portraitSrc: string`).
- Produces: `export default function HeroReveal({ cowlSrc, portraitSrc }: Props)` — a client `<Canvas>` (or shared into atmosphere): a **portrait plane** textured with `portraitSrc` (`THREE.TextureLoader`, `crossOrigin="anonymous"`), and in front a **dark cowl plane** whose fragment shader punches a soft circular hole at the pointer so the portrait shows only inside the beam. The bat/cowl silhouette (asset or `BatSilhouette`) sits above, always dark, defining the shape.

**Spotlight shader (the core mechanic) — cowl plane `ShaderMaterial`:**
```glsl
// uniforms: uPointer(vec2, plane-space -0.5..0.5), uRadius(float), uSoft(float)
// varying vUv (0..1)
void main() {
  vec2 p = vUv - 0.5 - uPointer;      // distance from beam centre
  float d = length(p);
  float hole = smoothstep(uRadius, uRadius - uSoft, d); // 1 inside beam
  // cowl is near-black; alpha fades to 0 inside the beam to reveal portrait
  gl_FragColor = vec4(0.039, 0.043, 0.051, 1.0 - hole);
}
```
- `useFrame` lerps `uPointer` toward `state.pointer` (desktop). Touch/no-pointer: drive `uPointer` along a slow Lissajous/arc via `clock.elapsedTime`.
- Reduced-motion: fix `uPointer` at centre and `uRadius` large (portrait softly visible), no chasing.
- Portrait texture load failure → set `portraitSrc` fallback flag; caller renders the CSS-mask DOM reveal instead (Task 2.2 fallback).

- [ ] **Step 1:** Implement portrait plane + cowl `ShaderMaterial` with the GLSL above; add `BatSilhouette` (an extruded `THREE.Shape` bat, dark, subtle bevel) used when `cowlSrc` is null.
- [ ] **Step 2:** Wire pointer lerp + touch arc + reduced-motion branch in `useFrame`.
- [ ] **Step 3:** Run `npm run build`. Expected: compiles.
- [ ] **Step 4:** Commit: `git commit -am "feat: 3D hero cowl with pointer-driven spotlight reveal"`

### Task 2.2: Hero section rewrite

**Files:**
- Modify: `components/sections/Hero.tsx` (replace HeroScene/SignalMesh usage)
- Modify: `app/page.tsx` (Hero now receives resolved asset props from the server component)

**Interfaces:**
- Consumes: `HeroReveal` (2.1), `resolveAsset`, `AVATAR_URL`.
- Produces: `export function Hero({ cowlSrc, portraitSrc }: { cowlSrc: string | null; portraitSrc: string })`.

- [ ] **Step 1:** In `page.tsx` (server) compute `const cowlSrc = resolveAsset("cowl"); const portraitSrc = resolveAsset("portrait") ?? AVATAR_URL;` and pass to `<Hero>`.
- [ ] **Step 2:** Rewrite Hero copy for the theme: eyebrow (role · independent, keep `Scramble`), display headline (e.g. "I build the systems that **watch over** the work."), tagline, CTAs (`.btn-signal` primary "Start a project" / hairline "View work"), telemetry stats. Keep the anime.js text timeline (rename classes but same structure); replace gradient underline with an amber `--signal` draw.
- [ ] **Step 3:** Right column: `dynamic(() => import("@/components/three/HeroReveal"), { ssr:false, loading: <CSS-mask reveal> })`. The CSS-mask fallback = portrait `<img>` under a dark `<div>` with `mask-image: radial-gradient(...)` following pointer via a CSS var (works without WebGL; reduced-motion shows portrait statically).
- [ ] **Step 4:** Run `npm run build` + browser check desktop (spotlight follows cursor) and narrow viewport (auto-sweep, no overflow). Expected: reveal works, degrades cleanly.
- [ ] **Step 5:** Commit: `git commit -am "feat: rebuild hero as the bat-signal reveal"`

---

## Phase 3 — Skills "The Utility Belt"

### Task 3.1: Tilt3D reusable wrapper

**Files:**
- Create: `components/fx/Tilt3D.tsx`

**Interfaces:**
- Produces: `export function Tilt3D({ children, className, max=8 }: {...})` — Motion `useMotionValue` rotateX/rotateY driven by pointer within bounds, `useSpring` smoothing, `transformPerspective: 800`, `preserve-3d`; disables on reduced-motion (renders static `<div>`); optional device-orientation (gyro) drive on touch.

- [ ] **Step 1:** Implement (generalize the current ProjectCard magnetic tilt); reduced-motion → plain div.
- [ ] **Step 2:** Run `npm run lint` + `build`. Expected: clean.
- [ ] **Step 3:** Commit: `git commit -am "feat: reusable Tilt3D perspective wrapper"`

### Task 3.2: Skills section

**Files:**
- Create: `components/sections/Skills.tsx`
- Modify: `app/page.tsx` (insert `<Skills>` after Hero)

**Interfaces:**
- Consumes: `skillGroups` (0.3), `Tilt3D` (3.1), `Reveal`.
- Produces: `export function Skills()`.

- [ ] **Step 1:** Section header "The Utility Belt" (`font-display`), sub. 4 `Tilt3D` `.panel` cards (one per group), each listing `items` as chips with a hairline; amber `--signal` accent on the group label; on hover a soft beam sweep (`SignalSweep` added in Phase 6, or inline radial highlight for now).
- [ ] **Step 2:** `id="skills"`; add to nav in `content/site.ts` (`{label:"Skills", href:"#skills"}`).
- [ ] **Step 3:** Run `build` + browser check tilt + reduced-motion static. Expected: 4 cards, depth on hover.
- [ ] **Step 4:** Commit: `git commit -am "feat: utility-belt skills section"`

---

## Phase 4 — Services "What I Deploy"

### Task 4.1: Re-skin Services

**Files:**
- Modify: `components/sections/Services.tsx`

**Interfaces:**
- Consumes: `services` (`content/services.ts`, unchanged), `Tilt3D`, `Reveal`.

- [ ] **Step 1:** Replace gradient classes with `.panel` + hairline; wrap each service card in `Tilt3D`; header "What I Deploy"; animate the divider as an amber draw; `points` as hairline-bulleted chips.
- [ ] **Step 2:** Run `build` + browser check. Expected: 4 dossier cards, no old-class errors.
- [ ] **Step 3:** Commit: `git commit -am "feat: re-skin services as dossier cards"`

---

## Phase 5 — Projects "Case Files"

### Task 5.1: Re-skin Work + ProjectCard (data + automation unchanged)

**Files:**
- Modify: `components/sections/Work.tsx`
- Modify: `components/work/ProjectCard.tsx`

**Interfaces:**
- Consumes: `getProjects()` (`lib/github.ts`, unchanged), `Tilt3D`.
- Produces: same props/shape as today — no data-layer change.

- [ ] **Step 1:** Replace `grad-border`/`text-gradient` with `.panel` + hairline + amber index numerals; convert ProjectCard tilt to `Tilt3D` (true perspective); add a "CASE FILE" stamp + status ("OPEN"/"ARCHIVED" from repo archived flag); keep live GitHub metadata (stars, language, updated) and links.
- [ ] **Step 2:** Header "Case Files"; keep `id="work"`.
- [ ] **Step 3:** Run `npm run test` (data-layer tests must still pass) + `build` + browser check. Expected: 3 flagship case files render with live metadata.
- [ ] **Step 4:** Commit: `git commit -am "feat: re-skin projects as case files"`

---

## Phase 6 — Contact + chrome

### Task 6.1: SignalSweep accent

**Files:**
- Create: `components/fx/SignalSweep.tsx`

**Interfaces:**
- Produces: `export function SignalSweep({ className })` — an absolutely-positioned amber radial that sweeps on hover/in-view (CSS keyframe), `pointer-events-none`, reduced-motion static. Retrofit into Skills/Services hovers.

- [ ] **Step 1:** Implement; add `@keyframes signal-sweep` to globals.css.
- [ ] **Step 2:** Commit: `git commit -am "feat: reusable bat-signal sweep accent"`

### Task 6.2: Contact "Light the Signal" + Nav/Footer reskin

**Files:**
- Modify: `components/sections/Contact.tsx`, `components/layout/Nav.tsx`, `components/layout/Footer.tsx` (paths per current tree)

**Interfaces:**
- Consumes: `site`, `activeSocials`, `hasBooking` (`content/site.ts`, unchanged), `resolveAsset("logo")` (nav mark) via server prop or a small client-safe default.

- [ ] **Step 1:** Contact: header "Light the Signal"; a projected bat emblem (asset or `BatSilhouette`) with amber glow as the focal CTA; `.btn-signal` for Book/Email; socials row (GitHub, Hugging Face, X @Ahmadtechai) as hairline chips.
- [ ] **Step 2:** Nav: replace `btn-grad` with `.btn-signal`; wordmark uses the bat logo (asset or drawn) + name; add "Skills" link.
- [ ] **Step 3:** Footer: `.hairline` top border, `font-display` name, amber accent.
- [ ] **Step 4:** Run `build` + browser check. Expected: cohesive chrome, working CTAs.
- [ ] **Step 5:** Commit: `git commit -am "feat: light-the-signal contact + Gotham nav/footer"`

---

## Phase 7 — Cleanup, metadata, ship

### Task 7.1: Remove retired components + update metadata/OG

**Files:**
- Delete: `components/fx/HeroScene.tsx` (old constellation), `components/fx/SignalMesh.tsx` (old 2D fallback) — only after confirming no imports remain.
- Modify: `app/layout.tsx` (metadata theme-color `#0a0b0d`), `app/opengraph-image.tsx` (Dark-Knight OG: near-black + amber signal), any `app/not-found.tsx` themed bits.

- [ ] **Step 1:** `grep` for `HeroScene`/`SignalMesh` imports; remove usages; delete files.
- [ ] **Step 2:** Update `themeColor`/OG image to the Gotham palette (amber bat-signal motif, name + role).
- [ ] **Step 3:** Run `npm run lint && npm run test && npm run build`. Expected: all clean, 20+ tests pass.
- [ ] **Step 4:** Commit: `git commit -am "chore: retire old hero, Gotham metadata + OG"`

### Task 7.2: Final QA + deploy

- [ ] **Step 1:** Browser QA: desktop spotlight reveal, touch auto-sweep, reduced-motion (OS setting) static, no-WebGL fallback (disable WebGL), no-JS (`<noscript>` content visible), no horizontal scroll at 360/768/1280.
- [ ] **Step 2:** Confirm live GitHub metadata + PR-sync workflow untouched (`.github/workflows/sync-projects.yml` unchanged).
- [ ] **Step 3:** Push to `main` (solo-authored) → Vercel auto-deploys. Verify production alias returns 200 and renders the Gotham hero.
- [ ] **Step 4:** Update memory (`portfolio-project.md`) with the new Batman/Dark-Knight identity, sections, and asset-slot convention.

---

## Self-review notes
- **Spec coverage:** palette (0.1), fonts (0.2), 3D strategy/atmosphere (1.x), hero reveal desktop+touch+reduced (2.x), asset resolver + fallback (0.4/2.1/6.2), skills (0.3/3.x), services (4.1), projects+automation kept (5.1), contact/socials (6.2), a11y/no-JS/no-WebGL (1.2/2.2/7.2), retire old (7.1), deploy+memory (7.2). All spec sections mapped.
- **Assets:** no copyrighted binaries fetched; drawn `BatSilhouette` fallback + user asset slots throughout.
- **Lint traps pre-empted:** rAF-deferred setState (0.5/2.x), seeded PRNG in geometry (1.1/2.1).
- **Data/automation:** projects, `lib/github.ts`, `lib/sync.mjs`, and the sync workflow are explicitly untouched.
