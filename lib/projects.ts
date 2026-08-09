import type { CuratedProject, GitHubMeta, Project } from "./types";
import registry from "@/content/registry.json";
import rawProjects from "@/content/projects.json";

export const OWNER: string = registry.owner;
export const IGNORED_REPOS: string[] = registry.ignored;

const REQUIRED_STRING_FIELDS: (keyof CuratedProject)[] = [
  "slug",
  "repo",
  "title",
  "tagline",
  "category",
  "problem",
  "solution",
  "outcome",
  "role",
];

/**
 * Validate raw project data (from content/projects.json). Throws a clear error
 * at build time if the manifest is malformed — better a broken build than a
 * broken page shipped to a prospective client.
 */
export function validateProjects(data: unknown): CuratedProject[] {
  if (!Array.isArray(data)) {
    throw new Error("projects.json must be an array of project objects");
  }
  const slugs = new Set<string>();
  return data.map((entry, i) => {
    if (typeof entry !== "object" || entry === null) {
      throw new Error(`projects.json[${i}] must be an object`);
    }
    const e = entry as Record<string, unknown>;
    for (const field of REQUIRED_STRING_FIELDS) {
      const value = e[field];
      if (typeof value !== "string" || value.length === 0) {
        throw new Error(`projects.json[${i}].${field} must be a non-empty string`);
      }
    }
    if (typeof e.order !== "number") {
      throw new Error(`projects.json[${i}].order must be a number`);
    }
    if (!Array.isArray(e.highlights) || !Array.isArray(e.stack)) {
      throw new Error(`projects.json[${i}] must include highlights[] and stack[]`);
    }
    const slug = e.slug as string;
    if (slugs.has(slug)) {
      throw new Error(`Duplicate project slug: "${slug}"`);
    }
    slugs.add(slug);

    return {
      slug,
      repo: e.repo as string,
      featured: e.featured !== false,
      order: e.order as number,
      title: e.title as string,
      tagline: e.tagline as string,
      category: e.category as string,
      problem: e.problem as string,
      solution: e.solution as string,
      outcome: e.outcome as string,
      role: e.role as string,
      highlights: (e.highlights as unknown[]).map(String),
      stack: (e.stack as unknown[]).map(String),
      liveUrl:
        typeof e.liveUrl === "string" && e.liveUrl.length > 0
          ? (e.liveUrl as string)
          : undefined,
    };
  });
}

/** Featured curated projects, validated and sorted by display order. */
export function loadCuratedProjects(): CuratedProject[] {
  return validateProjects(rawProjects)
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order);
}

/** Merge curated data with live GitHub metadata (null when the API is unavailable). */
export function mergeGitHub(project: CuratedProject, meta: GitHubMeta | null): Project {
  return {
    ...project,
    repoUrl: `https://github.com/${OWNER}/${project.repo}`,
    github: meta,
    liveUrl: project.liveUrl ?? (meta?.homepage || undefined),
  };
}
