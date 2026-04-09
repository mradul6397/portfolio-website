"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/utils";

function TorusKnot() {
  const mesh = useRef<THREE.Mesh | null>(null);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  useFrame(({ clock, pointer }) => {
    const m = mesh.current;
    if (!m) return;
    const t = clock.getElapsedTime();
    m.rotation.x = t * (reduced ? 0.12 : 0.22) + pointer.y * 0.25;
    m.rotation.y = t * (reduced ? 0.10 : 0.18) + pointer.x * 0.35;
  });

  return (
    <mesh ref={mesh}>
      <torusKnotGeometry args={[1.1, 0.34, 160, 22]} />
      <meshStandardMaterial
        color="#cfd3ff"
        roughness={0.25}
        metalness={0.65}
        emissive="#071019"
        emissiveIntensity={0.6}
      />
    </mesh>
  );
}

export function AboutCanvas() {
  const reduced = prefersReducedMotion();
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 2, 3]} intensity={1.0} />
      <pointLight position={[-3, -2, 2]} intensity={0.8} color="#4dffb4" />
      <TorusKnot />
    </Canvas>
  );
}

