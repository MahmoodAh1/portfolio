import { describe, it, expect } from "vitest";
import { selectNewRepos, stubFromRepo, slugify } from "@/lib/sync.mjs";

const base = {
  name: "cool",
  description: "does things",
  fork: false,
  archived: false,
  private: false,
};

describe("selectNewRepos", () => {
  it("selects a qualifying repo", () => {
    expect(selectNewRepos([base]).map((r) => r.name)).toEqual(["cool"]);
  });

  it("excludes forks, archived, private, and undescribed repos", () => {
    const repos = [
      { ...base, name: "f", fork: true },
      { ...base, name: "a", archived: true },
      { ...base, name: "p", private: true },
      { ...base, name: "d", description: "" },
      { ...base, name: "n", description: null },
    ];
    expect(selectNewRepos(repos)).toEqual([]);
  });

  it("excludes already-featured and ignored repos (case-insensitive)", () => {
    const repos = [
      { ...base, name: "CatalogIQ" },
      { ...base, name: "skipme" },
      { ...base, name: "keep" },
    ];
    const res = selectNewRepos(repos, {
      existingRepos: ["catalogiq"],
      ignored: ["SkipMe"],
    });
    expect(res.map((r) => r.name)).toEqual(["keep"]);
  });

  it("handles empty / missing input safely", () => {
    expect(selectNewRepos([])).toEqual([]);
    expect(selectNewRepos(undefined)).toEqual([]);
  });
});

describe("stubFromRepo", () => {
  it("builds a stub with TODO placeholders and derived fields", () => {
    const repo = {
      name: "my-cool-app",
      description: "A cool app",
      topics: ["ai", "fastapi"],
      homepage: "https://x.dev",
      languages: ["Python", "TypeScript"],
    };
    const stub = stubFromRepo(repo, 4);

    expect(stub.slug).toBe("my-cool-app");
    expect(stub.repo).toBe("my-cool-app");
    expect(stub.order).toBe(4);
    expect(stub.title).toBe("My Cool App");
    expect(stub.tagline).toBe("A cool app");
    expect(stub.stack).toEqual(["Python", "TypeScript"]);
    expect(stub.highlights).toEqual(["ai", "fastapi"]);
    expect(stub.liveUrl).toBe("https://x.dev");
    expect(stub.problem).toMatch(/TODO/);
    expect(stub.outcome).toMatch(/TODO/);
  });

  it("omits liveUrl and falls back to TODO stack/highlights", () => {
    const stub = stubFromRepo({ name: "x", description: "y" }, 1);
    expect(stub.liveUrl).toBeUndefined();
    expect(stub.stack).toEqual(["TODO: stack"]);
    expect(stub.highlights).toEqual(["TODO: highlight"]);
  });
});

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("My_Cool App!")).toBe("my-cool-app");
  });
});
