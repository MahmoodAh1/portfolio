"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";

const PALETTE = [
  new THREE.Color("#2de0d4"),
  new THREE.Color("#4c86ff"),
  new THREE.Color("#9b8cff"),
];

// Deterministic pseudo-random in [0,1) — keeps the memoized geometry pure.
function seeded(i: number): number {
  const x = Math.sin(i * 127.1 + 0.5) * 43758.5453;
  return x - Math.floor(x);
}

// Sample the 3-stop signature gradient at t ∈ [0,1].
function gradientColor(t: number): THREE.Color {
  const c = new THREE.Color();
  if (t < 0.5) c.lerpColors(PALETTE[0], PALETTE[1], t * 2);
  else c.lerpColors(PALETTE[1], PALETTE[2], (t - 0.5) * 2);
  return c;
}

// Soft radial sprite so points read as glowing nodes (additive blend).
function makeSprite(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.3, "rgba(255,255,255,0.85)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function Network() {
  const parallax = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const reduce = useReducedMotion();
  const { pointer } = useThree();

  const sprite = useMemo(() => makeSprite(), []);

  const { positions, colors, linePositions, lineColors } = useMemo(() => {
    const N = 48;
    const R = 2.15;
    const nodes: THREE.Vector3[] = [];
    const nodeColors: THREE.Color[] = [];

    // Fibonacci sphere distribution + slight radial jitter for depth.
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const jitter = 0.8 + seeded(i) * 0.35;
      const v = new THREE.Vector3(
        Math.cos(theta) * radius,
        y,
        Math.sin(theta) * radius,
      ).multiplyScalar(R * jitter);
      nodes.push(v);
      nodeColors.push(gradientColor((v.y / R + 1) / 2));
    }

    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    nodes.forEach((n, i) => {
      pos.set([n.x, n.y, n.z], i * 3);
      col.set([nodeColors[i].r, nodeColors[i].g, nodeColors[i].b], i * 3);
    });

    // Connect nearby nodes.
    const lp: number[] = [];
    const lc: number[] = [];
    const maxDist = 1.7;
    let count = 0;
    for (let i = 0; i < N && count < 130; i++) {
      for (let j = i + 1; j < N && count < 130; j++) {
        if (nodes[i].distanceTo(nodes[j]) < maxDist) {
          lp.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
          const ci = nodeColors[i];
          const cj = nodeColors[j];
          lc.push(ci.r, ci.g, ci.b, cj.r, cj.g, cj.b);
          count++;
        }
      }
    }

    return {
      positions: pos,
      colors: col,
      linePositions: new Float32Array(lp),
      lineColors: new Float32Array(lc),
    };
  }, []);

  useFrame((_, delta) => {
    const s = spin.current;
    const p = parallax.current;
    if (s && !reduce) {
      s.rotation.y += delta * 0.12;
      s.rotation.x += delta * 0.02;
    }
    if (p) {
      const tx = -pointer.y * 0.28;
      const ty = pointer.x * 0.4;
      p.rotation.x += (tx - p.rotation.x) * 0.05;
      p.rotation.y += (ty - p.rotation.y) * 0.05;
    }
  });

  return (
    <group ref={parallax}>
      <group ref={spin}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.32}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>

        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            map={sprite}
            size={0.4}
            sizeAttenuation
            vertexColors
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.4], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Network />
    </Canvas>
  );
}
