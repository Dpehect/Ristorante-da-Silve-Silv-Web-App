"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Premium subtle WebGL background for Hero.
 * Very delicate light rays + slow floating warm particles.
 * Designed to feel like sunlight through olive trees — never distracting.
 */
function LightRays() {
  const groupRef = useRef<THREE.Group>(null!);
  const raysRef = useRef<THREE.Group>(null!);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 28; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 18,
          Math.random() * -6 - 1,
          (Math.random() - 0.5) * 6 - 2,
        ] as [number, number, number],
        scale: Math.random() * 0.6 + 0.35,
        speed: Math.random() * 0.012 + 0.007,
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.05;

    // Extremely slow, poetic movement
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.015;
    }

    if (raysRef.current) {
      raysRef.current.rotation.z = Math.sin(t * 0.3) * 0.018;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Soft volumetric light rays */}
      <group ref={raysRef}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[i * 3.5 - 4, -1.5, -8]} rotation={[0.6, 0.3 + i * 0.2, 0]}>
            <planeGeometry args={[9, 22]} />
            <meshBasicMaterial
              color="#F5EDE2"
              transparent
              opacity={0.055 + i * 0.012}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Delicate floating warm particles (sun dust) */}
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[p.scale * 0.035]} />
          <meshBasicMaterial 
            color="#D4B48C" 
            transparent 
            opacity={0.12} 
            depthWrite={false} 
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ThreeHeroBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 52 }}
        style={{ background: "transparent" }}
        gl={{ 
          alpha: true, 
          antialias: true, 
          powerPreference: "high-performance",
          preserveDrawingBuffer: false 
        }}
      >
        <LightRays />
      </Canvas>
    </div>
  );
}
