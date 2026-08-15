"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BAT_PATH } from "@/components/fx/BatMark";

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Cover shader: dark bat-emblem cover that turns transparent inside a soft
// pointer-driven spotlight, with a warm amber rim at the beam edge.
const FRAG = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uPointer;
  uniform float uRadius;
  uniform float uSoft;
  uniform vec3 uSignal;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5 - uPointer;
    float d = length(p);
    float hole = smoothstep(uRadius, uRadius - uSoft, d);      // 1 inside beam
    vec4 t = texture2D(uTex, vUv);
    float ring = exp(-pow((d - uRadius) / max(uSoft, 0.0001), 2.0)) * 0.5;
    vec3 rgb = t.rgb + uSignal * ring;
    gl_FragColor = vec4(rgb, t.a * (1.0 - hole));
  }
`;

const SIZE = 512;

/** Paint the dark cover with the original bat emblem (steel + amber halo). */
function paintEmblem(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = "#0c0e12";
  ctx.fillRect(0, 0, SIZE, SIZE);
  const s = (SIZE * 0.82) / 120;
  const o = (SIZE - 120 * s) / 2;
  const path = new Path2D();
  path.addPath(new Path2D(BAT_PATH), new DOMMatrix([s, 0, 0, s, o, o]));
  const grad = ctx.createLinearGradient(0, 140, 0, 380);
  grad.addColorStop(0, "#cbd4df");
  grad.addColorStop(1, "#7f8b9b");
  ctx.shadowColor = "rgba(242,180,58,0.55)";
  ctx.shadowBlur = 28;
  ctx.fillStyle = grad;
  ctx.fill(path);
  ctx.shadowBlur = 0;
}

function makeCover(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  paintEmblem(canvas.getContext("2d")!);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/** Replace the drawn emblem cover with a user-supplied cowl image (contained). */
function drawCoverImage(tex: THREE.CanvasTexture, img: HTMLImageElement) {
  const canvas = tex.image as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#0c0e12";
  ctx.fillRect(0, 0, SIZE, SIZE);
  const scale = Math.min(SIZE / img.width, SIZE / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h);
  tex.needsUpdate = true;
}

interface SceneProps {
  portraitSrc: string;
  cowlSrc: string | null;
  onError?: () => void;
}

function RevealScene({ portraitSrc, cowlSrc, onError }: SceneProps) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const lastMove = useRef(0);
  const [portrait, setPortrait] = useState<THREE.Texture | null>(null);

  const cover = useMemo(() => makeCover(), []);

  const uniforms = useMemo(
    () => ({
      uTex: { value: cover },
      uPointer: { value: new THREE.Vector2(0, 0.04) },
      uRadius: { value: 0.2 },
      uSoft: { value: 0.13 },
      uSignal: { value: new THREE.Color("#f2b43a") },
    }),
    [cover],
  );

  // Optional user-supplied cowl image drawn onto the cover.
  useEffect(() => {
    if (!cowlSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => drawCoverImage(cover, img);
    img.src = cowlSrc;
  }, [cowlSrc, cover]);

  // Portrait texture (avatar or hi-res me.jpg); on failure signal a fallback.
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      portraitSrc,
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        setPortrait(t);
      },
      undefined,
      () => onError?.(),
    );
  }, [portraitSrc, onError]);

  useEffect(() => {
    const onMove = () => {
      lastMove.current = performance.now();
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    const m = mat.current;
    const g = group.current;
    const now = performance.now();

    let tx: number;
    let ty: number;
    if (now - lastMove.current > 2500) {
      const t = state.clock.elapsedTime; // idle → slow sweep
      tx = Math.sin(t * 0.6) * 0.3;
      ty = Math.sin(t * 0.9) * 0.22 + 0.02;
    } else {
      tx = state.pointer.x * 0.42;
      ty = state.pointer.y * 0.42;
    }

    if (m) {
      const pv = m.uniforms.uPointer.value as THREE.Vector2;
      pv.x += (tx - pv.x) * 0.1;
      pv.y += (ty - pv.y) * 0.1;
    }
    if (g) {
      g.rotation.y += (state.pointer.x * 0.16 - g.rotation.y) * 0.06;
      g.rotation.x += (-state.pointer.y * 0.14 - g.rotation.x) * 0.06;
    }
  });

  return (
    <group ref={group}>
      {portrait && (
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[2.6, 2.6]} />
          <meshBasicMaterial map={portrait} toneMapped={false} />
        </mesh>
      )}
      <mesh position={[0, 0, 0.2]}>
        <planeGeometry args={[2.6, 2.6]} />
        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          vertexShader={VERT}
          fragmentShader={FRAG}
        />
      </mesh>
    </group>
  );
}

export default function HeroReveal({
  portraitSrc,
  cowlSrc,
  onPortraitError,
}: {
  portraitSrc: string;
  cowlSrc: string | null;
  onPortraitError?: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <RevealScene portraitSrc={portraitSrc} cowlSrc={cowlSrc} onError={onPortraitError} />
    </Canvas>
  );
}
