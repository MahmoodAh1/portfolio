import { describe, it, expect } from "vitest";
import { validateProjects, mergeGitHub, loadCuratedProjects } from "@/lib/projects";
import type { GitHubMeta } from "@/lib/types";

const valid = {
  slug: "a",
  repo: "a-repo",
  order: 1,
  title: "A",
  tagline: "t",
  category: "c",
  problem: "p",
  solution: "s",
  outcome: "o",
  role: "r",
  highlights: ["h"],
  stack: ["S"],
};

const meta: GitHubMeta = {
  description: "d",
  stars: 5,
  language: "Python",
  languages: ["Python"],
  topics: [],
  pushedAt: null,
  homepage: "https://homepage.dev",
  htmlUrl: "https://github.com/x/a-repo",
  archived: false,
};

describe("validateProjects", () => {
  it("parses valid data and defaults featured to true", () => {
    const res = validateProjects([valid]);
    expect(res[0].slug).toBe("a");
    expect(res[0].featured).toBe(true);
  });

  it("throws on a non-array", () => {
    expect(() => validateProjects({})).toThrow();
  });

  it("throws with the offending field name when required data is missing", () => {
    const { problem: _omit, ...rest } = valid;
    void _omit;
    expect(() => validateProjects([rest])).toThrow(/problem/);
  });

  it("throws on a duplicate slug", () => {
    expect(() => validateProjects([valid, valid])).toThrow(/Duplicate/);
  });
});

describe("mergeGitHub", () => {
  const curated = validateProjects([valid])[0];

  it("merges live metadata and derives repoUrl + liveUrl", () => {
    const m = mergeGitHub(curated, meta);
    expect(m.github?.stars).toBe(5);
    expect(m.repoUrl).toContain("a-repo");
    expect(m.liveUrl).toBe("https://homepage.dev");
  });

  it("falls back gracefully when metadata is unavailable", () => {
    const m = mergeGitHub(curated, null);
    expect(m.github).toBeNull();
    expect(m.liveUrl).toBeUndefined();
    // still fully renderable from curated data
    expect(m.title).toBe("A");
  });

  it("prefers a curated liveUrl over the GitHub homepage", () => {
    const withLive = { ...curated, liveUrl: "https://curated.dev" };
    const m = mergeGitHub(withLive, meta);
    expect(m.liveUrl).toBe("https://curated.dev");
  });
});

describe("loadCuratedProjects (real manifest)", () => {
  it("loads the three flagships in display order", () => {
    const projects = loadCuratedProjects();
    expect(projects.map((p) => p.slug)).toEqual(["catalogiq", "nexguard", "jarvis"]);
  });
});
