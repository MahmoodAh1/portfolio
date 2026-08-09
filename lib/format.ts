/** Display formatting helpers. */

/** Compact relative time, e.g. "3d ago". Returns null for missing/invalid input. */
export function timeAgo(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return "just now";
  const units: [number, string][] = [
    [31536000, "y"],
    [2592000, "mo"],
    [604800, "w"],
    [86400, "d"],
    [3600, "h"],
    [60, "m"],
  ];
  for (const [secs, label] of units) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value}${label} ago`;
  }
  return "just now";
}

/** Compact number, e.g. 1200 -> "1.2k". */
export function compactNumber(n: number): string {
  if (n < 1000) return String(n);
  return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "k";
}
