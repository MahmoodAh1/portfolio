"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Deterministic pseudo-random in [0,1) — keeps memoized geometry pure.
function seeded(i: number): number {
  const x = Math.sin(i * 127.1 + 0.5) * 43758.5453;
  return x - Math.floor(x);
}

const COLD = new THREE.Color("#9fb2c8");
const SIGNAL = new THREE.Color("#f2b43a");

// Soft radial sprite so points read as glowing haze / lit windows.
function makeGlow(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.7)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// Vertical sky gradient the skyline silhouettes against.
function makeSky(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 4;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, "#11151d"); // cold steel high (near the signal)
  g.addColorStop(0.55, "#0b0d12");
  g.addColorStop(1, "#070809"); // near-black at the horizon
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/** Far sky plane — gives depth and lets the skyline read as silhouette. */
export function Backdrop() {
  const tex = useMemo(() => makeSky(), []);
  return (
    <mesh position={[0, 0, -9]}>
      <planeGeometry args={[40, 22]} />
      <meshBasicMaterial map={tex} depthWrite={false} />
    </mesh>
  );
}

interface Building {
  x: number;
  w: number;
  h: number;
  z: number;
}

function useSkyline(): Building[] {
  return useMemo(() => {
    const out: Building[] = [];
    let x = -10;
    for (let i = 0; i < 20; i++) {
      const w = 0.6 + seeded(i) * 0.95;
      const h = 1.1 + seeded(i + 30) * 3.4;
      const z = -5 - Math.floor(seeded(i + 60) * 3); // three depth layers
      out.push({ x, w, h, z });
      x += w + 0.14 + seeded(i + 90) * 0.32;
    }
    return out;
  }, []);
}

/** Gotham skyline — dark boxes cutting into the sky, with a few lit windows. */
export function Skyline() {
  const buildings = useSkyline();
  const glow = useMemo(() => makeGlow(), []);

  const windows = useMemo(() => {
    const pts: number[] = [];
    buildings.forEach((b, bi) => {
      const count = 3 + Math.floor(seeded(bi + 7) * 4);
      for (let k = 0; k < count; k++) {
        const wx = b.x + (seeded(bi * 9 + k) - 0.5) * b.w * 0.7;
        const wy = -4.2 + seeded(bi * 13 + k) * b.h * 0.9;
        pts.push(wx, wy, b.z + 0.32);
      }
    });
    return new Float32Array(pts);
  }, [buildings]);

  return (
    <group>
      {buildings.map((b, i) => (
        <mesh key={i} position={[b.x, -4.2 + b.h / 2, b.z]}>
          <boxGeometry args={[b.w, b.h, 0.7]} />
          <meshBasicMaterial color="#0d1016" />
        </mesh>
      ))}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[windows, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={glow}
          color={SIGNAL}
          size={0.16}
          sizeAttenuation
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/** Drifting cold haze. */
export function Fog() {
  const ref = useRef<THREE.Points>(null);
  const glow = useMemo(() => makeGlow(), []);
  const positions = useMemo(() => {
    const N = 70;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (seeded(i) * 2 - 1) * 10;
      pos[i * 3 + 1] = (seeded(i + 100) * 2 - 1) * 5.5;
      pos[i * 3 + 2] = -2 - seeded(i + 200) * 6;
    }
    return pos;
  }, []);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.012;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={glow}
        color={COLD}
        size={1.1}
        sizeAttenuation
        transparent
        opacity={0.09}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Sparse Gotham rain. */
export function Rain() {
  const ref = useRef<THREE.LineSegments>(null);
  const positions = useMemo(() => {
    const N = 90;
    const arr = new Float32Array(N * 6);
    for (let i = 0; i < N; i++) {
      const x = (seeded(i) * 2 - 1) * 11;
      const y = (seeded(i + 50) * 2 - 1) * 7;
      const z = -1 - seeded(i + 90) * 5;
      const len = 0.35 + seeded(i + 120) * 0.55;
      arr[i * 6] = x;
      arr[i * 6 + 1] = y;
      arr[i * 6 + 2] = z;
      arr[i * 6 + 3] = x + 0.04;
      arr[i * 6 + 4] = y - len;
      arr[i * 6 + 5] = z;
    }
    return arr;
  }, []);
  useFrame((_, d) => {
    const g = ref.current;
    if (!g) return;
    g.position.y -= d * 5;
    if (g.position.y < -3.5) g.position.y += 3.5;
  });
  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={COLD} transparent opacity={0.12} depthWrite={false} />
    </lineSegments>
  );
}

/** The bat-signal — a slow-sweeping amber volumetric beam with a source glow. */
export function BatSignalBeam() {
  const ref = useRef<THREE.Group>(null);
  const glow = useMemo(() => makeGlow(), []);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.11) * 0.5 + 0.3;
    }
  });
  return (
    <group ref={ref} position={[2.8, 3.4, -4]}>
      {/* cone points down-left from the source; open-ended for a beam look */}
      <mesh position={[0, -3.4, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[1.35, 8, 32, 1, true]} />
        <meshBasicMaterial
          color={SIGNAL}
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <sprite scale={[1.8, 1.8, 1]}>
        <spriteMaterial
          map={glow}
          color={SIGNAL}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}
