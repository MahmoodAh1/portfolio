import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Theme asset resolution. The site prefers user-supplied files at fixed
 * `public/` paths; when none is present it falls back to a drawn original
 * bat silhouette so nothing looks broken. Server-only (uses `fs`) — call from
 * server components and pass the result down as props.
 */

/** Return the first candidate filename that exists in `baseDir`, else null. */
export function firstExisting(baseDir: string, candidates: string[]): string | null {
  for (const c of candidates) {
    if (existsSync(join(baseDir, c))) return c;
  }
  return null;
}

const PUBLIC_DIR = join(process.cwd(), "public");

const CANDIDATES = {
  logo: ["bat-logo.svg", "bat-logo.png"],
  cowl: ["cowl.glb", "cowl.png", "cowl.svg"],
  portrait: ["me.jpg", "me.png", "me.webp"],
  vehicle: ["batmobile.glb", "vehicle.glb", "car.glb"],
} as const;

export type AssetKind = keyof typeof CANDIDATES;

/** Resolve a themed asset to its public URL, or null to use the drawn fallback. */
export function resolveAsset(kind: AssetKind): string | null {
  const found = firstExisting(PUBLIC_DIR, [...CANDIDATES[kind]]);
  return found ? `/${found}` : null;
}

/** GitHub avatar used for the hero portrait until a hi-res `me.jpg` is added. */
export const AVATAR_URL = "https://avatars.githubusercontent.com/MahmoodAh1?size=800";
