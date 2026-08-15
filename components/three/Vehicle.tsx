"use client";

import { useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * An original angular, matte-black tactical vehicle (not a reproduction of any
 * trademarked car design). Low-poly primitives with amber thrusters + underglow.
 * Orbits as the reader scrolls: `progress` is a 0..1 ref driven by the section.
 */

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.54, 0.54, 0.44, 28]} />
        <meshStandardMaterial color="#05060a" roughness={0.85} metalness={0.15} />
      </mesh>
      {/* amber hub */}
      <mesh position={[0, 0.23, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 20]} />
        <meshStandardMaterial color="#000" emissive="#f2b43a" emissiveIntensity={1.6} />
      </mesh>
    </group>
  );
}

function Car({ progress }: { progress: RefObject<number> }) {
  const car = useRef<THREE.Group>(null);

  useFrame((state) => {
    const p = progress.current ?? 0;
    const g = car.current;
    if (!g) return;
    // Scroll orbits the vehicle from a 3/4 front to the rear.
    g.rotation.y = -0.5 + p * Math.PI * 1.7;
    // Gentle idle hover.
    g.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.04;
  });

  const body = <meshStandardMaterial color="#0e1116" metalness={0.6} roughness={0.4} />;

  return (
    <group ref={car} position={[0, 0, 0]}>
      {/* lower chassis */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[4.2, 0.35, 1.9]} />
        {body}
      </mesh>
      {/* upper body */}
      <mesh position={[-0.1, 0.78, 0]} castShadow>
        <boxGeometry args={[3.2, 0.4, 1.6]} />
        <meshStandardMaterial color="#0e1116" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* angled nose wedge */}
      <mesh position={[1.95, 0.5, 0]} rotation={[0, 0, -0.14]} castShadow>
        <boxGeometry args={[1.2, 0.28, 1.5]} />
        <meshStandardMaterial color="#0e1116" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* front splitter */}
      <mesh position={[2.25, 0.3, 0]} castShadow>
        <boxGeometry args={[0.6, 0.06, 2.0]} />
        <meshStandardMaterial color="#05060a" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* side pods */}
      <mesh position={[0, 0.55, 0.95]} castShadow>
        <boxGeometry args={[2.4, 0.4, 0.35]} />
        <meshStandardMaterial color="#0c0e12" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.55, -0.95]} castShadow>
        <boxGeometry args={[2.4, 0.4, 0.35]} />
        <meshStandardMaterial color="#0c0e12" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* canopy */}
      <mesh position={[-0.2, 1.06, 0]} rotation={[0, 0, -0.05]} castShadow>
        <boxGeometry args={[1.3, 0.4, 1.05]} />
        <meshStandardMaterial color="#04060a" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* raised rear */}
      <mesh position={[-1.6, 0.78, 0]} castShadow>
        <boxGeometry args={[1.0, 0.5, 1.5]} />
        <meshStandardMaterial color="#0e1116" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* rear wing */}
      <mesh position={[-2.15, 1.16, 0]} castShadow>
        <boxGeometry args={[0.5, 0.06, 2.1]} />
        <meshStandardMaterial color="#0c0e12" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[-2.15, 0.95, 0.8]} castShadow>
        <boxGeometry args={[0.08, 0.42, 0.08]} />
        {body}
      </mesh>
      <mesh position={[-2.15, 0.95, -0.8]} castShadow>
        <boxGeometry args={[0.08, 0.42, 0.08]} />
        <meshStandardMaterial color="#0e1116" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* headlight strips */}
      <mesh position={[2.48, 0.56, 0.5]}>
        <boxGeometry args={[0.05, 0.09, 0.5]} />
        <meshStandardMaterial color="#000" emissive="#dfe7f2" emissiveIntensity={2.2} />
      </mesh>
      <mesh position={[2.48, 0.56, -0.5]}>
        <boxGeometry args={[0.05, 0.09, 0.5]} />
        <meshStandardMaterial color="#000" emissive="#dfe7f2" emissiveIntensity={2.2} />
      </mesh>

      {/* rear thrusters + light */}
      <mesh position={[-2.3, 0.62, 0.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.12, 20]} />
        <meshStandardMaterial color="#000" emissive="#f2b43a" emissiveIntensity={2.6} />
      </mesh>
      <mesh position={[-2.3, 0.62, -0.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.12, 20]} />
        <meshStandardMaterial color="#000" emissive="#f2b43a" emissiveIntensity={2.6} />
      </mesh>
      <pointLight position={[-2.9, 0.62, 0]} intensity={3} distance={4.5} color="#f2b43a" />

      {/* underglow */}
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[3, 0.03, 1.2]} />
        <meshStandardMaterial color="#000" emissive="#f2b43a" emissiveIntensity={1.1} />
      </mesh>

      <Wheel position={[1.4, 0.52, 1.03]} />
      <Wheel position={[1.4, 0.52, -1.03]} />
      <Wheel position={[-1.4, 0.52, 1.05]} />
      <Wheel position={[-1.4, 0.52, -1.05]} />
    </group>
  );
}

function Rig({ progress }: { progress: RefObject<number> }) {
  useFrame((state) => {
    const p = progress.current ?? 0;
    state.camera.position.set(5.6, 2.5 - p * 0.7, 7 - p * 1.6);
    state.camera.lookAt(0, 0.7, 0);
  });
  return <Car progress={progress} />;
}

export default function VehicleScene({ progress }: { progress: RefObject<number> }) {
  return (
    <Canvas
      shadows
      camera={{ position: [5.6, 2.5, 7], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[4, 7, 4]}
        intensity={1.3}
        color="#cfe0ff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <directionalLight position={[-5, 3, -4]} intensity={0.6} color="#f2b43a" />

      <Rig progress={progress} />

      {/* dark grounded floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#070809" metalness={0.5} roughness={0.6} />
      </mesh>
    </Canvas>
  );
}
