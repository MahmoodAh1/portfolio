"use client";

import { Suspense, useEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { createTimeline } from "animejs";
import {
  RoundedBox,
  Environment,
  Lightformer,
  ContactShadows,
  useGLTF,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

/**
 * A premium, original angular tactical vehicle (not a reproduction of any
 * trademarked car). Rounded-box modelling, metallic paint reacting to a
 * self-contained studio environment, contact shadows, amber emissive lights,
 * and a bloom pass. If the user drops a real model at `public/batmobile.glb`
 * (etc.) it loads that instead. Orbits with scroll via a 0..1 `progress` ref.
 */

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* tyre */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.44, 0.44, 0.4, 40]} />
        <meshStandardMaterial color="#08090c" roughness={0.85} metalness={0.05} />
      </mesh>
      {/* rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.27, 0.27, 0.42, 28]} />
        <meshStandardMaterial color="#1b1f26" metalness={1} roughness={0.28} />
      </mesh>
      {/* glowing hub */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.44, 18]} />
        <meshStandardMaterial color="#000" emissive="#f2b43a" emissiveIntensity={2.6} />
      </mesh>
    </group>
  );
}

function paint() {
  return <meshStandardMaterial color="#0b0d11" metalness={0.92} roughness={0.26} />;
}
function carbon() {
  return <meshStandardMaterial color="#070809" metalness={0.4} roughness={0.55} />;
}

/** Original built vehicle (fallback when no user GLB is supplied). */
function BuiltVehicle() {
  return (
    <group>
      {/* floor pan */}
      <RoundedBox args={[4.7, 0.24, 2.0]} radius={0.1} smoothness={4} position={[0, 0.46, 0]}>
        {carbon()}
      </RoundedBox>
      {/* main tub */}
      <RoundedBox args={[4.4, 0.5, 1.9]} radius={0.24} smoothness={4} position={[0, 0.64, 0]}>
        {paint()}
      </RoundedBox>
      {/* hood */}
      <RoundedBox args={[1.7, 0.3, 1.7]} radius={0.16} smoothness={4} position={[1.45, 0.66, 0]}>
        {paint()}
      </RoundedBox>
      {/* nose */}
      <RoundedBox args={[0.8, 0.24, 1.5]} radius={0.1} smoothness={4} position={[2.35, 0.54, 0]}>
        {paint()}
      </RoundedBox>
      {/* cabin / dark glass greenhouse */}
      <RoundedBox args={[1.9, 0.56, 1.5]} radius={0.26} smoothness={4} position={[-0.15, 1.02, 0]}>
        <meshStandardMaterial color="#05070c" metalness={1} roughness={0.06} />
      </RoundedBox>
      {/* roof spine */}
      <RoundedBox args={[0.5, 0.18, 0.5]} radius={0.06} smoothness={4} position={[-1.0, 1.16, 0]}>
        {paint()}
      </RoundedBox>
      {/* rear haunches */}
      <RoundedBox args={[1.7, 0.6, 2.0]} radius={0.28} smoothness={4} position={[-1.45, 0.72, 0]}>
        {paint()}
      </RoundedBox>
      {/* rear deck */}
      <RoundedBox args={[0.9, 0.24, 1.7]} radius={0.1} smoothness={4} position={[-1.95, 0.88, 0]}>
        {paint()}
      </RoundedBox>
      {/* front splitter */}
      <RoundedBox args={[0.5, 0.08, 2.1]} radius={0.03} smoothness={3} position={[2.55, 0.34, 0]}>
        {carbon()}
      </RoundedBox>
      {/* side skirts */}
      <RoundedBox args={[2.7, 0.16, 0.22]} radius={0.05} smoothness={3} position={[0, 0.42, 1.0]}>
        {carbon()}
      </RoundedBox>
      <RoundedBox args={[2.7, 0.16, 0.22]} radius={0.05} smoothness={3} position={[0, 0.42, -1.0]}>
        {carbon()}
      </RoundedBox>
      {/* rear diffuser */}
      <RoundedBox args={[0.5, 0.26, 1.8]} radius={0.04} smoothness={3} position={[-2.35, 0.42, 0]}>
        {carbon()}
      </RoundedBox>
      {/* rear wing */}
      <RoundedBox args={[0.55, 0.06, 2.2]} radius={0.03} smoothness={3} position={[-2.25, 1.28, 0]}>
        {carbon()}
      </RoundedBox>
      <mesh position={[-2.25, 1.05, 0.85]}>
        <boxGeometry args={[0.07, 0.42, 0.07]} />
        {paint()}
      </mesh>
      <mesh position={[-2.25, 1.05, -0.85]}>
        <boxGeometry args={[0.07, 0.42, 0.07]} />
        {paint()}
      </mesh>

      {/* headlights */}
      <RoundedBox args={[0.06, 0.1, 0.55]} radius={0.02} smoothness={2} position={[2.72, 0.58, 0.55]}>
        <meshStandardMaterial color="#000" emissive="#eaf2ff" emissiveIntensity={2.6} />
      </RoundedBox>
      <RoundedBox args={[0.06, 0.1, 0.55]} radius={0.02} smoothness={2} position={[2.72, 0.58, -0.55]}>
        <meshStandardMaterial color="#000" emissive="#eaf2ff" emissiveIntensity={2.6} />
      </RoundedBox>
      {/* taillight bar */}
      <RoundedBox args={[0.05, 0.12, 1.5]} radius={0.02} smoothness={2} position={[-2.55, 0.82, 0]}>
        <meshStandardMaterial color="#000" emissive="#f2b43a" emissiveIntensity={3.2} />
      </RoundedBox>
      {/* thrusters + light */}
      <mesh position={[-2.5, 0.64, 0.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.12, 24]} />
        <meshStandardMaterial color="#000" emissive="#f2b43a" emissiveIntensity={3.4} />
      </mesh>
      <mesh position={[-2.5, 0.64, -0.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.12, 24]} />
        <meshStandardMaterial color="#000" emissive="#f2b43a" emissiveIntensity={3.4} />
      </mesh>
      <pointLight position={[-3.1, 0.64, 0]} intensity={4} distance={5} color="#f2b43a" />
      {/* underglow */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[3.2, 0.03, 1.3]} />
        <meshStandardMaterial color="#000" emissive="#f2b43a" emissiveIntensity={1.3} />
      </mesh>

      <Wheel position={[1.55, 0.44, 1.0]} />
      <Wheel position={[1.55, 0.44, -1.0]} />
      <Wheel position={[-1.55, 0.44, 1.02]} />
      <Wheel position={[-1.55, 0.44, -1.02]} />
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
    state.camera.lookAt(0, 0.7, 0);
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
      <ambientLight intensity={0.25} />
      <spotLight position={[6, 8, 4]} angle={0.4} penumbra={0.8} intensity={2} color="#cfe0ff" />

      {/* Self-contained studio environment for reflective paint (no external HDR). */}
      <Environment resolution={256}>
        <Lightformer intensity={2.4} position={[0, 5, 1]} scale={[10, 3, 1]} />
        <Lightformer intensity={1.4} position={[5, 2, 4]} scale={[6, 6, 1]} color="#cfe0ff" />
        <Lightformer intensity={2} position={[-6, 3, -3]} scale={[6, 4, 1]} color="#f2b43a" />
        <Lightformer intensity={1} position={[0, 1, -7]} scale={[12, 4, 1]} />
      </Environment>

      <Suspense fallback={null}>
        <Scene progress={progress} vehicleSrc={vehicleSrc} />
      </Suspense>

      <ContactShadows
        position={[0, 0.02, 0]}
        opacity={0.7}
        scale={14}
        blur={2.6}
        far={5}
        color="#000000"
      />

      <EffectComposer>
        <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.55} luminanceSmoothing={0.2} />
        <Vignette eskil={false} offset={0.25} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  );
}
