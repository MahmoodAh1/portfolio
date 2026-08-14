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
