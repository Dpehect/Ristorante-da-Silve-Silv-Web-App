"use client";

import React, { useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

/**
 * Cinematic Preload for Ristorante da Silve
 * - Three.js particle system representing floating olive leaves / warm light particles
 * - Custom WebGL shader for soft glow, subtle distortion, and heat haze effect
 * - Poetic, warm, intimate opening that sets the emotional tone of Puglia
 */

function Particles({ progress }: { progress: number }) {
  const pointsRef = React.useRef<THREE.Points>(null!);
  const materialRef = React.useRef<THREE.ShaderMaterial>(null!);

  const count = 120;

  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count * 3; i += 3) {
      // Spread particles in a soft vertical field, like floating in warm air
      pos[i] = (Math.random() - 0.5) * 9;
      pos[i + 1] = (Math.random() - 0.5) * 6 - 1;
      pos[i + 2] = (Math.random() - 0.5) * 5;

      velocities[i] = (Math.random() - 0.5) * 0.008;
      velocities[i + 1] = Math.random() * 0.015 + 0.003; // gentle upward drift
      velocities[i + 2] = (Math.random() - 0.5) * 0.008;

      sizes[i / 3] = Math.random() * 1.8 + 0.7;
    }
    return { pos, velocities, sizes };
  }, []);

  const uniforms = React.useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uColor: { value: new THREE.Color('#f5e8d3') },
    uGlowColor: { value: new THREE.Color('#d4a373') },
  }), []);

  // Custom WebGL Shader for poetic light + distortion
  const vertexShader = `
    uniform float uTime;
    uniform float uProgress;
    attribute float size;
    varying float vSize;
    varying float vProgress;

    void main() {
      vec3 pos = position;
      
      // Gentle organic movement like floating leaves in warm wind
      float wave = sin(uTime * 0.6 + pos.x * 1.8) * 0.4;
      pos.y += wave * (0.3 + uProgress * 0.5);
      pos.x += cos(uTime * 0.5 + pos.z) * 0.25;
      
      // Slow reveal as preload progresses
      pos.y += (1.0 - uProgress) * -6.0;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      vSize = size * (0.6 + uProgress * 0.8);
      vProgress = uProgress;
      gl_PointSize = vSize * (300.0 / -mvPosition.z);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform float uProgress;
    uniform vec3 uColor;
    uniform vec3 uGlowColor;
    varying float vSize;
    varying float vProgress;

    void main() {
      vec2 uv = gl_PointCoord - vec2(0.5);
      float dist = length(uv);
      
      // Soft circular particle with elegant falloff
      float alpha = 1.0 - smoothstep(0.0, 0.55, dist);
      
      // Add subtle heat haze / light distortion effect
      float haze = sin(uTime * 2.2 + uv.x * 8.0) * 0.035 + cos(uTime * 1.6) * 0.02;
      alpha *= (0.75 + haze * 3.0) * vProgress;
      
      // Warm glowing core with soft edges
      vec3 color = mix(uColor, uGlowColor, smoothstep(0.1, 0.45, dist) * 0.6);
      color += uGlowColor * (1.0 - dist * 2.2) * 0.35;
      
      gl_FragColor = vec4(color, alpha * 0.92);
    }
  `;

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uProgress.value = progress;
    }
    
    if (pointsRef.current) {
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.15;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.pos, 3]}
          count={count}
          array={positions.pos}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[positions.sizes, 1]}
          count={count}
          array={positions.sizes}
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
      />
    </points>
  );
}

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Cinematic loading sequence — slow, emotional, deliberate
    const tl = gsap.timeline({
      onUpdate: () => {
        setProgress(tl.progress());
      },
      onComplete: () => {
        // Elegant exit
        gsap.to(".preloader", {
          opacity: 0,
          duration: 1.2,
          ease: "power2.inOut",
          onComplete: () => {
            setIsVisible(false);
            onComplete();
          }
        });
      }
    });

    // Slow, poetic progress — feels like watching light move across a table
    tl.to({}, { duration: 2.8 }); // Hold for emotional impact

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="preloader fixed inset-0 z-[999] flex items-center justify-center bg-[#f8f4ed] overflow-hidden">
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 7], fov: 55 }}
          style={{ background: 'transparent' }}
          gl={{ 
            alpha: true, 
            antialias: true, 
            powerPreference: "high-performance" 
          }}
        >
          <Particles progress={progress} />
        </Canvas>
      </div>

      {/* Elegant text overlay */}
      <div className="relative z-10 text-center pointer-events-none">
        <div className="font-serif text-[13px] tracking-[6px] text-[#8a7b6c] mb-2">
          FASANO • PUGLIA
        </div>
        <div className="font-serif text-6xl md:text-7xl tracking-[-2.5px] text-[#2a211c]">
          da Silve
        </div>
        <div className="mt-3 text-[#5c5146] text-sm tracking-[1.5px]">
          A TABLE AT HOME
        </div>

        {/* Subtle progress indicator */}
        <div className="mt-12 w-px h-8 mx-auto bg-[#d9d0c1]" />
        <div className="text-[10px] tracking-[3px] text-[#8a7b6c] mt-2 font-mono">
          {Math.floor(progress * 100)}%
        </div>
      </div>

      {/* Warm vignette for cinematic feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#f8f4ed_60%,transparent_85%)] pointer-events-none" />
    </div>
  );
}
