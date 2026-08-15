"use client";

import { Suspense, useEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  RoundedBox,
  Environment,
  Lightformer,
  ContactShadows,
  useGLTF,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { createTimeline } from "animejs";
import * as THREE from "three";

/**
 * A sleek, original black supercar (not a reproduction of any trademarked
 * vehicle). Low, wide, curved cabin, glossy black paint reacting to a
 * self-contained studio environment, contact shadows, amber accents, and a
 * bloom pass. If the user drops a real model at `public/batmobile.glb` (etc.)
 * it loads that instead. Orbits with scroll via an anime.js timeline scrubbed
 * by a 0..1 `progress` ref.
 */

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* tyre */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.44, 0.44, 0.36, 44]} />
        <meshStandardMaterial color="#080a0d" roughness={0.8} metalness={0.1} />
      </mesh>
      {/* rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.29, 0.29, 0.38, 32]} />
        <meshStandardMaterial color="#20242c" metalness={1} roughness={0.22} />
      </mesh>
      {/* brake glow */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.4, 20]} />
        <meshStandardMaterial color="#000" emissive="#f2b43a" emissiveIntensity={2.2} />
      </mesh>
    </group>
  );
}

function paint() {
  return <meshStandardMaterial color="#0a0c10" metalness={0.95} roughness={0.22} />;
}
function carbon() {
  return <meshStandardMaterial color="#050609" metalness={0.5} roughness={0.5} />;
}

/** Original built supercar (fallback when no user GLB is supplied). */
function BuiltVehicle() {
  return (
    <group>
      {/* underbody */}
      <RoundedBox args={[4.9, 0.2, 1.9]} radius={0.09} smoothness={4} position={[0, 0.42, 0]}>
        {carbon()}
      </RoundedBox>
      {/* low wide main body */}
      <RoundedBox args={[4.7, 0.42, 1.98]} radius={0.3} smoothness={5} position={[0, 0.6, 0]}>
        {paint()}
      </RoundedBox>
      {/* long hood, angled down */}
      <RoundedBox args={[1.9, 0.24, 1.72]} radius={0.16} smoothness={5} position={[1.5, 0.58, 0]} rotation={[0, 0, -0.05]}>
        {paint()}
      </RoundedBox>
      {/* low pointed nose */}
      <RoundedBox args={[0.75, 0.2, 1.42]} radius={0.09} smoothness={4} position={[2.55, 0.5, 0]}>
        {paint()}
      </RoundedBox>
      {/* curved glass cabin (flattened sphere) */}
      <mesh position={[-0.1, 0.92, 0]} scale={[1.55, 0.5, 0.92]}>
        <sphereGeometry args={[1, 40, 28]} />
        <meshStandardMaterial color="#04060a" metalness={1} roughness={0.05} />
      </mesh>
      {/* curved rear haunches */}
      <RoundedBox args={[1.9, 0.52, 2.06]} radius={0.36} smoothness={5} position={[-1.5, 0.62, 0]}>
        {paint()}
      </RoundedBox>
      {/* rear deck slope */}
      <RoundedBox args={[1.0, 0.2, 1.72]} radius={0.12} smoothness={5} position={[-2.05, 0.74, 0]}>
        {paint()}
      </RoundedBox>
      {/* ducktail spoiler */}
      <RoundedBox args={[0.5, 0.08, 1.9]} radius={0.04} smoothness={4} position={[-2.5, 0.88, 0]}>
        {paint()}
      </RoundedBox>
      {/* front splitter */}
      <RoundedBox args={[0.5, 0.06, 2.02]} radius={0.03} smoothness={3} position={[2.65, 0.33, 0]}>
        {carbon()}
      </RoundedBox>
      {/* side intakes / skirts */}
      <RoundedBox args={[1.5, 0.2, 0.14]} radius={0.05} smoothness={3} position={[0.2, 0.52, 1.0]}>
        {carbon()}
      </RoundedBox>
      <RoundedBox args={[1.5, 0.2, 0.14]} radius={0.05} smoothness={3} position={[0.2, 0.52, -1.0]}>
        {carbon()}
      </RoundedBox>
      {/* rear diffuser */}
      <RoundedBox args={[0.45, 0.22, 1.8]} radius={0.04} smoothness={3} position={[-2.6, 0.4, 0]}>
        {carbon()}
      </RoundedBox>

      {/* swept LED headlights */}
      <RoundedBox args={[0.5, 0.05, 0.14]} radius={0.02} smoothness={2} position={[2.45, 0.62, 0.6]} rotation={[0, -0.2, 0]}>
        <meshStandardMaterial color="#000" emissive="#eaf2ff" emissiveIntensity={2.8} />
      </RoundedBox>
      <RoundedBox args={[0.5, 0.05, 0.14]} radius={0.02} smoothness={2} position={[2.45, 0.62, -0.6]} rotation={[0, 0.2, 0]}>
        <meshStandardMaterial color="#000" emissive="#eaf2ff" emissiveIntensity={2.8} />
      </RoundedBox>
      {/* full-width taillight bar */}
      <RoundedBox args={[0.05, 0.08, 1.55]} radius={0.02} smoothness={2} position={[-2.78, 0.72, 0]}>
        <meshStandardMaterial color="#000" emissive="#f2b43a" emissiveIntensity={3.4} />
      </RoundedBox>
      {/* quad exhausts + glow */}
      {[0.22, -0.22].map((z) => (
        <mesh key={z} position={[-2.72, 0.5, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.14, 18]} />
          <meshStandardMaterial color="#000" emissive="#f2b43a" emissiveIntensity={3} />
        </mesh>
      ))}
      <pointLight position={[-3.3, 0.55, 0]} intensity={4} distance={5} color="#f2b43a" />
      {/* underglow */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[3.4, 0.03, 1.3]} />
        <meshStandardMaterial color="#000" emissive="#f2b43a" emissiveIntensity={1.2} />
      </mesh>

      <Wheel position={[1.6, 0.44, 1.0]} />
      <Wheel position={[1.6, 0.44, -1.0]} />
      <Wheel position={[-1.6, 0.44, 1.02]} />
      <Wheel position={[-1.6, 0.44, -1.02]} />
    </group>
  );
}

/** User-supplied model. Only mounted when a file was resolved, so useGLTF is safe. */
function UserVehicle({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function Scene({ progress, vehicleSrc }: { progress: RefObject<number>; vehicleSrc: string | null }) {
  const car = useRef<THREE.Group>(null);
  const anim = useRef({ spin: -0.55, camY: 2.6, camZ: 7.2, tilt: 0 });
  const tl = useRef<ReturnType<typeof createTimeline> | null>(null);

  // anime.js choreographs the scroll sequence; we scrub it by scroll progress.
  useEffect(() => {
    const timeline = createTimeline({ autoplay: false, defaults: { ease: "inOutQuad" } });
    timeline
      .add(anim.current, { spin: Math.PI * 1.1, camZ: 6.3, camY: 2.15, tilt: 0.06, duration: 1000 })
      .add(anim.current, { spin: Math.PI * 2.15, camZ: 5.2, camY: 1.55, tilt: -0.04, duration: 1000 });
    tl.current = timeline;
    return () => {
      timeline.pause();
    };
  }, []);

  useFrame((state) => {
    const p = progress.current ?? 0;
    const timeline = tl.current;
    if (timeline) timeline.seek(p * timeline.duration);
    const a = anim.current;
    const g = car.current;
    if (g) {
      g.rotation.y = a.spin;
      g.rotation.z = a.tilt;
      g.position.y = Math.sin(state.clock.elapsedTime * 1.1) * 0.03;
    }
    state.camera.position.set(5.8, a.camY, a.camZ);
    state.camera.lookAt(0, 0.6, 0);
  });

  return (
    <group ref={car}>
      {vehicleSrc ? <UserVehicle url={vehicleSrc} /> : <BuiltVehicle />}
    </group>
  );
}

export default function VehicleScene({
  progress,
  vehicleSrc,
}: {
  progress: RefObject<number>;
  vehicleSrc: string | null;
}) {
  return (
    <Canvas
      camera={{ position: [5.8, 2.6, 7.2], fov: 38 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.22} />
      <spotLight position={[6, 9, 4]} angle={0.4} penumbra={0.9} intensity={2.2} color="#cfe0ff" />

      {/* Self-contained studio environment for reflective paint (no external HDR). */}
      <Environment resolution={256}>
        <Lightformer intensity={2.6} position={[0, 5, 1]} scale={[10, 3, 1]} />
        <Lightformer intensity={1.5} position={[5, 2, 4]} scale={[6, 6, 1]} color="#cfe0ff" />
        <Lightformer intensity={2.2} position={[-6, 3, -3]} scale={[6, 4, 1]} color="#f2b43a" />
        <Lightformer intensity={1} position={[0, 1, -7]} scale={[12, 4, 1]} />
      </Environment>

      <Suspense fallback={null}>
        <Scene progress={progress} vehicleSrc={vehicleSrc} />
      </Suspense>

      <ContactShadows position={[0, 0.02, 0]} opacity={0.75} scale={14} blur={2.8} far={5} color="#000000" />

      <EffectComposer>
        <Bloom mipmapBlur intensity={1.2} luminanceThreshold={0.55} luminanceSmoothing={0.2} />
        <Vignette eskil={false} offset={0.28} darkness={0.78} />
      </EffectComposer>
    </Canvas>
  );
}
