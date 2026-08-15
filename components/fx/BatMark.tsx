/**
 * Original stylized bat emblem — the drawn stand-in used until the user drops a
 * real logo at `public/bat-logo.svg`. Generic bat silhouette, not a reproduction
 * of any trademarked emblem. Shared by the hero cover, nav mark, and contact.
 */
export const BAT_PATH =
  "M60 42 C 57 35 52 32 49 37 C 45 27 34 24 24 30 C 30 32 31 36 29 41 C 22 36 12 38 6 46 C 14 45 18 49 18 55 C 26 49 36 50 44 57 C 49 61 55 64 60 72 C 65 64 71 61 76 57 C 84 50 94 49 102 55 C 102 49 106 45 114 46 C 108 38 98 36 91 41 C 89 36 90 32 96 30 C 86 24 75 27 71 37 C 68 32 63 35 60 42 Z";

export function BatMark({
  className,
  title = "Bat emblem",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label={title}
      fill="currentColor"
    >
      <path d={BAT_PATH} />
    </svg>
  );
}
