/**
 * Decorative "signal network" motif for the hero.
 * Rings + connecting lines carry `.hero-draw` (stroke line-draw on load);
 * nodes carry `.hero-node` (pop-in + ambient pulse). Animated by Hero via anime.js.
 */
export function HeroVisual() {
  const nodes: [number, number, number][] = [
    [240, 240, 7], // center
    [118, 128, 5],
    [366, 112, 5],
    [402, 300, 5],
    [250, 398, 5],
    [96, 322, 5],
    [312, 214, 4],
    [176, 300, 4],
  ];

  const lines: [number, number, number, number][] = [
    [240, 240, 118, 128],
    [240, 240, 366, 112],
    [240, 240, 402, 300],
    [240, 240, 250, 398],
    [240, 240, 96, 322],
    [118, 128, 366, 112],
    [366, 112, 402, 300],
    [250, 398, 96, 322],
    [312, 214, 402, 300],
    [176, 300, 96, 322],
  ];

  return (
    <svg
      viewBox="0 0 480 480"
      className="hero-visual h-full w-full"
      role="img"
      aria-label="Abstract network of connected nodes"
      data-anim
      style={{ opacity: 0 }}
    >
      <g stroke="var(--accent)" fill="none">
        <circle className="hero-draw" cx="240" cy="240" r="185" strokeOpacity="0.18" strokeWidth="1" />
        <circle className="hero-draw" cx="240" cy="240" r="128" strokeOpacity="0.28" strokeWidth="1" />
        {lines.map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            className="hero-draw"
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            strokeOpacity="0.45"
            strokeWidth="1"
          />
        ))}
      </g>

      <g fill="var(--accent)">
        {nodes.map(([cx, cy, r], i) => (
          <circle
            key={i}
            className="hero-node"
            cx={cx}
            cy={cy}
            r={r}
            data-anim
            style={{ opacity: 0 }}
          />
        ))}
      </g>
    </svg>
  );
}
