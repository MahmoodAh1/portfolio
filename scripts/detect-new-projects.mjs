#!/usr/bin/env node
/**
 * Detects public GitHub repos that aren't yet in the portfolio and appends
 * stub entries to content/projects.json (with TODO placeholders to fill in).
 *
 * Run by .github/workflows/sync-projects.yml, which opens a PR when this script
 * makes changes — that PR is the "ask me before it goes live" gate.
 *
 * Usage: node scripts/detect-new-projects.mjs
 * Env:   GITHUB_TOKEN (optional) raises the API rate limit.
 *        GITHUB_OUTPUT (set by Actions) receives `changed` / `repos` outputs.
 */

import { readFile, writeFile } from "node:fs/promises";
import { appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { selectNewRepos, stubFromRepo } from "../lib/sync.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PROJECTS_PATH = path.join(ROOT, "content", "projects.json");
const REGISTRY_PATH = path.join(ROOT, "content", "registry.json");

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

function ghHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-sync",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function listRepos(owner) {
  const repos = [];
  for (let page = 1; page <= 5; page++) {
    const res = await fetch(
      `https://api.github.com/users/${owner}/repos?per_page=100&page=${page}&sort=pushed`,
      { headers: ghHeaders() },
    );
    if (!res.ok) {
      throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
    }
    const batch = await res.json();
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos;
}

async function fetchLanguages(owner, name) {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${name}/languages`, {
      headers: ghHeaders(),
    });
    if (!res.ok) return [];
    return Object.keys(await res.json());
  } catch {
    return [];
  }
}

function setOutput(key, value) {
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
  }
}

async function main() {
  const registry = JSON.parse(await readFile(REGISTRY_PATH, "utf8"));
  const projects = JSON.parse(await readFile(PROJECTS_PATH, "utf8"));
  const owner = registry.owner;

  const existingRepos = projects.map((p) => p.repo);
  const repos = await listRepos(owner);
  const candidates = selectNewRepos(repos, {
    existingRepos,
    ignored: registry.ignored || [],
  });

  if (candidates.length === 0) {
    console.log("No new projects detected.");
    setOutput("changed", "false");
    return;
  }

  let order = projects.reduce((max, p) => Math.max(max, p.order || 0), 0);
  const stubs = [];
  for (const repo of candidates) {
    const languages = await fetchLanguages(owner, repo.name);
    order += 1;
    stubs.push(stubFromRepo({ ...repo, languages }, order));
  }

  const next = [...projects, ...stubs];
  await writeFile(PROJECTS_PATH, JSON.stringify(next, null, 2) + "\n", "utf8");

  const names = stubs.map((s) => s.repo).join(", ");
  console.log(`Added ${stubs.length} project stub(s): ${names}`);
  setOutput("changed", "true");
  setOutput("repos", names);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
