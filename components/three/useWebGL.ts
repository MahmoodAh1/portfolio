"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Progressive-enhancement gate for the 3D layers.
 *
 * `enabled` becomes true only after mount, when WebGL is supported AND the user
 * has not requested reduced motion. The `setState` is deferred inside
 * `requestAnimationFrame` to satisfy the `react-hooks/set-state-in-effect` rule.
 */
export function useWebGL(): { ready: boolean; enabled: boolean } {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let supported = false;
    try {
      const canvas = document.createElement("canvas");
      supported = Boolean(
        canvas.getContext("webgl2") || canvas.getContext("webgl"),
      );
    } catch {
      supported = false;
    }

    const id = requestAnimationFrame(() => {
      setReady(true);
      setEnabled(supported && !reduce);
    });
    return () => cancelAnimationFrame(id);
  }, [reduce]);

  return { ready, enabled };
}
