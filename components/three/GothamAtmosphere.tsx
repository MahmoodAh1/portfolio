"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import { Backdrop, Skyline, Fog, Rain, BatSignalBeam } from "./atmosphere-parts";

/** Subtle pointer parallax over the whole Gotham scene. */
function ParallaxScene() {
  const group = useRef<Group>(null);
  const { pointer } = useThree();
  useFrame(() => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += (pointer.x * 0.06 - g.rotation.y) * 0.04;
    g.rotation.x += (-pointer.y * 0.04 - g.rotation.x) * 0.04;
  });
  return (
    <group ref={group}>
      <Backdrop />
      <Skyline />
      <Fog />
      <Rain />
      <BatSignalBeam />
    </group>
  );
}

/** Persistent full-viewport 3D Gotham backdrop. Client-only, lazy-mounted. */
export default function GothamAtmosphere() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ParallaxScene />
    </Canvas>
  );
}
