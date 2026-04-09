"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/utils";

function FloatingInstances({ count }: { count: number }) {
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { positions, rotations, scales } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const rotations = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = (Math.random() - 0.5) * 10.5;
      positions[i3 + 1] = (Math.random() - 0.5) * 6.5;
      positions[i3 + 2] = (Math.random() - 0.5) * 8.0;
      rotations[i3 + 0] = Math.random() * Math.PI;
      rotations[i3 + 1] = Math.random() * Math.PI;
      rotations[i3 + 2] = Math.random() * Math.PI;
      scales[i] = 0.35 + Math.random() * 0.95;
    }
    return { positions, rotations, scales };
  }, [count]);

  useFrame(({ clock, pointer }) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const t = clock.getElapsedTime();
    const px = pointer.x * 0.35;
    const py = pointer.y * 0.25;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      dummy.position.set(
        positions[i3 + 0] + Math.sin(t * 0.25 + i) * 0.08 + px,
        positions[i3 + 1] + Math.cos(t * 0.22 + i) * 0.08 + py,
        positions[i3 + 2],
      );
      dummy.rotation.set(
        rotations[i3 + 0] + t * 0.12,
        rotations[i3 + 1] + t * 0.14,
        rotations[i3 + 2] + t * 0.08,
      );
      dummy.scale.setScalar(scales[i]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      frustumCulled
    >
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#d7d7de"
        roughness={0.35}
        metalness={0.45}
        emissive="#0b1620"
        emissiveIntensity={0.55}
      />
    </instancedMesh>
  );
}

function ParticleField({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points | null>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3 + 0] = (Math.random() - 0.5) * 18;
      arr[i3 + 1] = (Math.random() - 0.5) * 10;
      arr[i3 + 2] = -6 - Math.random() * 10;
    }
    return arr;
  }, [count]);

  useFrame(({ clock, pointer }) => {
    const p = pointsRef.current;
    if (!p) return;
    const t = clock.getElapsedTime();
    p.rotation.y = t * 0.03 + pointer.x * 0.08;
    p.rotation.x = t * 0.02 + pointer.y * 0.06;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#6aa6ff"
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

export function HeroCanvas() {
  const reduced = prefersReducedMotion();
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia?.("(max-width: 768px)")?.matches;
  const instances = reduced ? 18 : isMobile ? 28 : 55;
  const particles = reduced ? 520 : isMobile ? 900 : 1500;

  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
    >
      <color attach="background" args={["#07080b"]} />
      <fog attach="fog" args={["#07080b", 7, 20]} />

      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 3, 5]} intensity={1.1} />
      <pointLight position={[-4, -2, 2]} intensity={0.8} color="#4dffb4" />

      <Float speed={reduced ? 0.2 : 0.75} rotationIntensity={0.45} floatIntensity={0.55}>
        <FloatingInstances count={instances} />
      </Float>
      <ParticleField count={particles} />
    </Canvas>
  );
}

