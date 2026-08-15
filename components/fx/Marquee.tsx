import { BatMark } from "./BatMark";

/** Ambient capability ticker: a slow band of movement with the bat mark between items. */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items]; // duplicated for a seamless -50% loop
  return (
    <div className="marquee-mask relative overflow-hidden border-y border-border/50 bg-surface/20 py-4">
      <div className="marquee-track">
        {row.map((item, i) => (
          <span
            key={i}
            className="mx-5 inline-flex items-center gap-5 whitespace-nowrap font-mono text-sm uppercase tracking-[0.15em] text-muted"
          >
            {item}
            <span aria-hidden className="text-signal/70">
              <BatMark className="h-3.5 w-3.5" title="" />
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
