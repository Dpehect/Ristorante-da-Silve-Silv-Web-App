"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Elegant 3D Dish Preview
 * Subtle 3D interaction for the premium menu.
 * - A refined ceramic plate (cylinder)
 * - A soft food element (torus or sphere) with warm color
 * - Gentle auto breathing rotation + mouse tilt
 * - Very refined, low-poly, soft lighting — never gimmicky
 */

interface Dish3DProps {
  color?: string;      // Main food color (terracotta/olive/cream tones)
  secondary?: string;  // Accent color
  mouseX?: number;     // -1 to 1
  mouseY?: number;
}

function DishScene({ color = '#a35f3f', secondary = '#4a5c3f', mouseX = 0, mouseY = 0 }: Dish3DProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const plateRef = useRef<THREE.Group>(null!);

  // Subtle continuous motion + react to mouse
  useFrame((state) => {
    if (groupRef.current) {
      // Very slow elegant breathing rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.12 + mouseX * 0.35;
      groupRef.current.rotation.x = mouseY * -0.25;
    }

    // Subtle wobble on the "food" part
    if (plateRef.current) {
      plateRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Elegant low ceramic plate */}
      <group>
        <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.1, 1.15, 0.18, 48]} />
          <meshPhongMaterial 
            color="#e8d9c2" 
            shininess={35} 
            specular="#ffffff" 
          />
        </mesh>
        {/* Subtle plate rim highlight */}
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[1.15, 1.15, 0.04, 48, 1, true]} />
          <meshPhongMaterial 
            color="#c9b8a0" 
            side={THREE.DoubleSide} 
            shininess={20} 
          />
        </mesh>
      </group>

      {/* Refined "food" element — can represent pasta, fish, or dessert */}
      <group ref={plateRef} position={[0, 0.05, 0]}>
        {/* Soft mound / main element */}
        <mesh castShadow>
          <sphereGeometry args={[0.55, 32, 24]} />
          <meshPhongMaterial 
            color={color} 
            shininess={15} 
            specular="#222222"
            emissive={secondary}
            emissiveIntensity={0.03}
          />
        </mesh>

        {/* Delicate top detail (herb / garnish / crust) */}
        <mesh position={[0, 0.38, 0]} castShadow>
          <torusGeometry args={[0.38, 0.09, 16, 48, Math.PI * 1.6]} />
          <meshPhongMaterial 
            color={secondary} 
            shininess={8}
          />
        </mesh>

        {/* Tiny elegant olive or detail sphere */}
        <mesh position={[0.32, 0.22, 0.15]}>
          <sphereGeometry args={[0.11]} />
          <meshPhongMaterial color="#3a3f2e" shininess={40} />
        </mesh>
      </group>

      {/* Very soft rim lighting */}
      <pointLight position={[-2, 3, 2]} intensity={0.6} color="#fff8e7" />
      <ambientLight intensity={0.75} color="#f8f1e3" />
    </group>
  );
}

export default function Dish3D({ 
  color = '#a35f3f', 
  secondary = '#4a5c3f',
  mouseX = 0, 
  mouseY = 0 
}: Dish3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0.6, 3.2], fov: 38 }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true, 
          powerPreference: "high-performance",
          preserveDrawingBuffer: false
        }}
      >
        <DishScene 
          color={color} 
          secondary={secondary} 
          mouseX={mouseX} 
          mouseY={mouseY} 
        />
      </Canvas>
    </div>
  );
}
