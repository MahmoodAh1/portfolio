/**
 * Pure helpers for detecting and stubbing new GitHub projects.
 * Shared by scripts/detect-new-projects.mjs and the Vitest suite so the logic
 * is unit-tested rather than buried in a workflow script.
 */

/**
 * From a list of GitHub repos, select those that should be proposed as new
 * portfolio entries: public, non-fork, non-archived, described, and not already
 * featured or explicitly ignored.
 *
 * @param {Array<object>} repos - GitHub `/users/{owner}/repos` objects.
 * @param {{ existingRepos?: string[], ignored?: string[] }} opts
 * @returns {Array<object>} candidate repos
 */
export function selectNewRepos(repos, { existingRepos = [], ignored = [] } = {}) {
  const existing = new Set(existingRepos.map((r) => String(r).toLowerCase()));
  const skip = new Set(ignored.map((r) => String(r).toLowerCase()));

  return (repos || []).filter((repo) => {
    if (!repo || typeof repo.name !== "string") return false;
    if (repo.fork) return false;
    if (repo.archived) return false;
    if (repo.private) return false;
    if (!repo.description || String(repo.description).trim().length === 0) return false;

    const name = repo.name.toLowerCase();
    if (existing.has(name)) return false;
    if (skip.has(name)) return false;
    return true;
  });
}

/** Build a manifest stub (with TODO placeholders) from a GitHub repo object. */
export function stubFromRepo(repo, order) {
  const stub = {
    slug: slugify(repo.name),
    repo: repo.name,
    featured: true,
    order,
    title: titleize(repo.name),
    tagline: repo.description ? oneLine(repo.description) : "TODO: one-line tagline.",
    category: "TODO: category",
    problem: "TODO: what problem does this solve?",
    solution: repo.description ? String(repo.description) : "TODO: what did you build?",
    outcome: "TODO: measurable result.",
    role: "TODO: your role.",
    highlights:
      Array.isArray(repo.topics) && repo.topics.length > 0
        ? repo.topics.slice(0, 6)
        : ["TODO: highlight"],
    stack:
      Array.isArray(repo.languages) && repo.languages.length > 0
        ? repo.languages
        : ["TODO: stack"],
  };
  if (repo.homepage) stub.liveUrl = repo.homepage;
  return stub;
}

export function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleize(name) {
  return String(name)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function oneLine(text) {
  const trimmed = String(text).trim();
  return trimmed.length > 120 ? trimmed.slice(0, 117).trimEnd() + "…" : trimmed;
}
