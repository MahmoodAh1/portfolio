import type { GitHubMeta, Project } from "./types";
import { OWNER, loadCuratedProjects, mergeGitHub } from "./projects";

const API = "https://api.github.com";
// ISR: revalidate live GitHub metadata hourly.
const REVALIDATE_SECONDS = 3600;

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  // Optional read-only token — raises rate limits from 60/hr to 5000/hr.
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/**
 * Fetch live metadata for a repo. Returns null on any failure (network error,
 * rate limit, 404) so callers fall back to curated data — the page never breaks.
 */
export async function fetchRepoMeta(repo: string): Promise<GitHubMeta | null> {
  try {
    const [repoRes, langRes] = await Promise.all([
      fetch(`${API}/repos/${OWNER}/${repo}`, {
        headers: githubHeaders(),
        next: { revalidate: REVALIDATE_SECONDS },
      }),
      fetch(`${API}/repos/${OWNER}/${repo}/languages`, {
        headers: githubHeaders(),
        next: { revalidate: REVALIDATE_SECONDS },
      }),
    ]);

    if (!repoRes.ok) return null;
    const data = await repoRes.json();
    const languages = langRes.ok ? Object.keys(await langRes.json()) : [];

    return {
      description: data.description ?? null,
      stars: typeof data.stargazers_count === "number" ? data.stargazers_count : 0,
      language: data.language ?? null,
      languages,
      topics: Array.isArray(data.topics) ? data.topics : [],
      pushedAt: data.pushed_at ?? null,
      homepage: data.homepage || null,
      htmlUrl: data.html_url ?? `https://github.com/${OWNER}/${repo}`,
      archived: Boolean(data.archived),
    };
  } catch {
    return null;
  }
}

/** All featured projects, enriched with live GitHub metadata. */
export async function getProjects(): Promise<Project[]> {
  const curated = loadCuratedProjects();
  const metas = await Promise.all(curated.map((p) => fetchRepoMeta(p.repo)));
  return curated.map((project, i) => mergeGitHub(project, metas[i]));
}

/** A single project by slug, enriched with live metadata. Null if not found. */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const curated = loadCuratedProjects().find((p) => p.slug === slug);
  if (!curated) return null;
  const meta = await fetchRepoMeta(curated.repo);
  return mergeGitHub(curated, meta);
}
