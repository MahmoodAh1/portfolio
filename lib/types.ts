/** Shared types for the project data layer. */

/** Curated, hand-written project data (source of truth = content/projects.json). */
export interface CuratedProject {
  /** URL slug, e.g. "catalogiq". */
  slug: string;
  /** GitHub repo name under the configured owner. */
  repo: string;
  featured: boolean;
  /** Display order (ascending). */
  order: number;
  /** Display title, e.g. "CatalogIQ". */
  title: string;
  tagline: string;
  category: string;
  problem: string;
  solution: string;
  /** Measurable result. Placeholder "TODO: ..." until real metrics land. */
  outcome: string;
  role: string;
  highlights: string[];
  stack: string[];
  /** Optional live demo URL (falls back to GitHub homepage if present). */
  liveUrl?: string;
}

/** Live metadata pulled from the GitHub API at build/ISR time. */
export interface GitHubMeta {
  description: string | null;
  stars: number;
  language: string | null;
  languages: string[];
  topics: string[];
  pushedAt: string | null;
  homepage: string | null;
  htmlUrl: string;
  archived: boolean;
}

/** A curated project enriched with live GitHub metadata (null if unavailable). */
export interface Project extends CuratedProject {
  repoUrl: string;
  github: GitHubMeta | null;
}
