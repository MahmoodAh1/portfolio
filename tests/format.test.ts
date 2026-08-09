import { describe, it, expect } from "vitest";
import { timeAgo, compactNumber } from "@/lib/format";

describe("timeAgo", () => {
  it("returns null for missing or invalid input", () => {
    expect(timeAgo(null)).toBeNull();
    expect(timeAgo(undefined)).toBeNull();
    expect(timeAgo("not-a-date")).toBeNull();
  });

  it("formats a time a couple of days ago", () => {
    const twoDays = new Date(Date.now() - 2 * 86400 * 1000).toISOString();
    expect(timeAgo(twoDays)).toBe("2d ago");
  });

  it("treats a fresh timestamp as just now", () => {
    expect(timeAgo(new Date().toISOString())).toBe("just now");
  });
});

describe("compactNumber", () => {
  it("passes through small numbers", () => {
    expect(compactNumber(0)).toBe("0");
    expect(compactNumber(999)).toBe("999");
  });

  it("compacts thousands", () => {
    expect(compactNumber(1000)).toBe("1k");
    expect(compactNumber(1200)).toBe("1.2k");
    expect(compactNumber(15000)).toBe("15k");
  });
});
