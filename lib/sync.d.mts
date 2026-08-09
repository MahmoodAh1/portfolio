/** Type declarations for the plain-JS sync helpers in sync.mjs. */

export interface GitHubRepoLike {
  name: string;
  description?: string | null;
  fork?: boolean;
  archived?: boolean;
  private?: boolean;
  topics?: string[];
  homepage?: string | null;
  languages?: string[];
}

export interface ProjectStub {
  slug: string;
  repo: string;
  featured: boolean;
  order: number;
  title: string;
  tagline: string;
  category: string;
  problem: string;
  solution: string;
  outcome: string;
  role: string;
  highlights: string[];
  stack: string[];
  liveUrl?: string;
}

export function selectNewRepos(
  repos: GitHubRepoLike[] | null | undefined,
  opts?: { existingRepos?: string[]; ignored?: string[] },
): GitHubRepoLike[];

export function stubFromRepo(repo: GitHubRepoLike, order: number): ProjectStub;

export function slugify(name: string): string;
