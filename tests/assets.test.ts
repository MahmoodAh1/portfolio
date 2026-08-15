import { describe, it, expect } from "vitest";
import { firstExisting } from "@/lib/assets";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("firstExisting", () => {
  it("returns the first candidate that exists, else null", () => {
    const dir = mkdtempSync(join(tmpdir(), "assets-"));
    writeFileSync(join(dir, "cowl.png"), "x");
    expect(firstExisting(dir, ["cowl.glb", "cowl.png"])).toBe("cowl.png");
    expect(firstExisting(dir, ["nope.svg"])).toBeNull();
  });
});
