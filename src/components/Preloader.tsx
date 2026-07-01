"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

const vertexShader = `
uniform float uTime;
attribute float size;
varying vec3 vColor;

void main() {
  vColor = color;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  
  // Subtle wave movement
  mvPosition.y += sin(uTime * 0.5 + position.x) * 0.5;
  mvPosition.x += cos(uTime * 0.3 + position.y) * 0.5;
  
  gl_PointSize = size * (30.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
varying vec3 vColor;

void main() {
  // Soft glowing circle
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  float alpha = 0.05 / distanceToCenter - 0.1;
  
  if(alpha < 0.0) discard;
  
  gl_FragColor = vec4(vColor, alpha);
}
`;

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const particlesCount = 2000;
  
  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);
    
    const colorPrimary = new THREE.Color("#f5f0e6");
    const colorAccent = new THREE.Color("#8b7355");

    for (let i = 0; i < particlesCount; i++) {
      // Create a cinematic volume
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const mixedColor = colorPrimary.clone().lerp(colorAccent, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      sizes[i] = Math.random() * 2.0;
    }

    return [positions, colors, sizes];
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={particlesCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={particlesCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  );
}

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Artificial delay to show preloader cinematic effect
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReady) {
      const tl = gsap.timeline({
        onComplete: onComplete
      });

      tl.to(textRef.current, {
        opacity: 1,
        duration: 2,
        ease: "power2.inOut",
      })
      .to(textRef.current, {
        opacity: 0,
        duration: 1.5,
        delay: 1,
        ease: "power2.inOut",
      })
      .to(containerRef.current, {
        opacity: 0,
        duration: 2,
        ease: "power2.inOut",
      }, "-=0.5");
    }
  }, [isReady, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-secondary"
    >
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <color attach="background" args={["#2c2a26"]} />
          <Particles />
        </Canvas>
      </div>
      <div
        ref={textRef}
        className="relative z-10 opacity-0 pointer-events-none mix-blend-difference text-primary text-center"
      >
        <h1 className="text-4xl md:text-6xl tracking-[0.2em] uppercase font-light">
          Ristorante<br/>da Silve
        </h1>
        <p className="mt-4 text-sm tracking-widest text-accent uppercase">
          Fasano, Puglia
        </p>
      </div>
    </div>
  );
}
