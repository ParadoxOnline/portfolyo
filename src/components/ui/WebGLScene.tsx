"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useMode } from "@/providers/ModeProvider";

function ParticleSwarm() {
  const ref = useRef<THREE.Points>(null!);
  
  // Create a sphere of particles
  const [positions] = React.useState(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 10 + Math.random() * 20;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    return pos;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#64748b"
          size={0.045}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.45}
        />
      </Points>
    </group>
  );
}

export default function WebGLScene() {
  const { mode } = useMode();
  
  if (mode === "recruiter") return null;

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-bg-base">
      <Canvas camera={{ position: [0, 0, 15] }}>
        <fog attach="fog" args={['#020406', 10, 30]} />
        <ambientLight intensity={0.5} />
        <ParticleSwarm />
      </Canvas>
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#020406_100%)] pointer-events-none" />
    </div>
  );
}
