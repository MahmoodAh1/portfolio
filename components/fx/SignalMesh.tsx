"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

// [cx, cy, r]
const NODES: [number, number, number][] = [
  [240, 240, 7],
  [118, 128, 5],
  [366, 112, 5],
  [402, 300, 5],
  [250, 398, 5],
  [96, 322, 5],
  [312, 214, 4],
  [176, 300, 4],
];

// [x1, y1, x2, y2]
const EDGES: [number, number, number, number][] = [
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

/**
 * The hero signature: an AI "signal mesh" that draws its edges on load, then
 * streams light packets along the connections while nodes breathe.
 */
export function SignalMesh() {
  const rootRef = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const controls: any[] = [];

    (async () => {
      const { animate, createTimeline, stagger, svg, utils } = await import("animejs");
      const root = rootRef.current;
      if (cancelled || !root) return;

      const anim = root.querySelectorAll("[data-anim]");

      if (reduce) {
        utils.set(anim, { opacity: 1, scale: 1 });
        return;
      }

      const tl = createTimeline({ defaults: { ease: "outExpo" } });
      tl.add(root.querySelectorAll(".mesh-ring"), { opacity: [0, 1], scale: [0.92, 1], duration: 1000 }, 0)
        .add(
          svg.createDrawable(root.querySelectorAll(".mesh-edge")),
          { draw: ["0 0", "0 1"], duration: 1200, ease: "inOutQuad", delay: stagger(55) },
          200,
        )
        .add(
          root.querySelectorAll(".mesh-node"),
          { opacity: [0, 1], scale: [0, 1], ease: "outBack", duration: 620, delay: stagger(45) },
          700,
        );
      controls.push(tl);

      // Light packets travel each edge.
      EDGES.forEach((_, i) => {
        const path = svg.createMotionPath(`#mesh-edge-${i}`);
        const packet = animate(`#mesh-packet-${i}`, {
          translateX: path.translateX,
          translateY: path.translateY,
          opacity: [
            { to: 0, duration: 0 },
            { to: 1, duration: 220 },
            { to: 1, duration: 1400 },
            { to: 0, duration: 320 },
          ],
          duration: 2200,
          loop: true,
          ease: "inOutSine",
          delay: 1100 + i * 170,
        });
        controls.push(packet);
      });

      // Nodes breathe.
      controls.push(
        animate(root.querySelectorAll(".mesh-node"), {
          scale: [1, 1.28],
          opacity: [0.72, 1],
          loop: true,
          alternate: true,
          duration: 2100,
          delay: stagger(150),
          ease: "inOutSine",
        }),
      );
    })();

    return () => {
      cancelled = true;
      controls.forEach((c) => c?.revert?.());
    };
  }, [reduce]);

  return (
    <svg
      ref={rootRef}
      viewBox="0 0 480 480"
      className="h-full w-full overflow-visible"
      role="img"
      aria-label="Animated network of connected AI systems"
    >
      <defs>
        <linearGradient id="mesh-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2de0d4" />
          <stop offset="0.55" stopColor="#4c86ff" />
          <stop offset="1" stopColor="#9b8cff" />
        </linearGradient>
        <radialGradient id="packet-grad">
          <stop offset="0" stopColor="#c9fff9" />
          <stop offset="1" stopColor="#2de0d4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Rings */}
      <g fill="none" stroke="url(#mesh-grad)">
        <circle className="mesh-ring" data-anim cx="240" cy="240" r="186" strokeOpacity="0.14" strokeWidth="1" style={{ opacity: 0 }} />
        <circle className="mesh-ring" data-anim cx="240" cy="240" r="128" strokeOpacity="0.22" strokeWidth="1" style={{ opacity: 0 }} />
      </g>

      {/* Edges */}
      <g fill="none" stroke="url(#mesh-grad)" strokeWidth="1.1" strokeOpacity="0.5">
        {EDGES.map(([x1, y1, x2, y2], i) => (
          <path
            key={i}
            id={`mesh-edge-${i}`}
            className="mesh-edge"
            data-anim
            d={`M${x1} ${y1} L${x2} ${y2}`}
            style={{ opacity: 0 }}
          />
        ))}
      </g>

      {/* Packets */}
      <g>
        {EDGES.map((_, i) => (
          <circle key={i} id={`mesh-packet-${i}`} r="9" fill="url(#packet-grad)" style={{ opacity: 0 }} />
        ))}
      </g>

      {/* Nodes */}
      <g fill="url(#mesh-grad)">
        {NODES.map(([cx, cy, r], i) => (
          <circle key={i} className="mesh-node" data-anim cx={cx} cy={cy} r={r} style={{ opacity: 0 }} />
        ))}
      </g>
    </svg>
  );
}
