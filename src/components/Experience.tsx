"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ExperienceShader = `
uniform float uTime;
varying vec2 vUv;

void main() {
  vec2 center = vec2(0.5);
  float dist = distance(vUv, center);
  
  // Ambient heat haze/distortion
  float distortion = sin(uTime * 0.5 + dist * 10.0) * 0.05;
  vec3 color = mix(vec3(0.1, 0.09, 0.08), vec3(0.54, 0.45, 0.33), dist + distortion);
  
  gl_FragColor = vec4(color, 1.0);
}
`;

function AmbientBackground() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, -5]} scale={[20, 20, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader="varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }"
        fragmentShader={ExperienceShader}
        uniforms={{ uTime: { value: 0 } }}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !elementsRef.current) return;

    const ctx = gsap.context(() => {
      const items = elementsRef.current?.children;
      if (items) {
        gsap.from(items, {
          y: 100,
          opacity: 0,
          stagger: 0.2,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            end: "center center",
            scrub: 1,
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative py-48 min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <AmbientBackground />
        </Canvas>
      </div>

      <div className="relative z-10 px-8 md:px-24 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div ref={elementsRef} className="space-y-16 text-center">
          <h2 className="text-4xl md:text-6xl font-light tracking-wide text-primary">The Atmosphere</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-primary/80">
            <div className="space-y-4">
              <h3 className="text-xl italic font-serif text-accent">Intimate</h3>
              <p className="text-sm tracking-wide leading-relaxed">Only five tables per evening. Ensuring an environment of peace, connection, and full attention.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl italic font-serif text-accent">Curated</h3>
              <p className="text-sm tracking-wide leading-relaxed">A cellar built over decades. Wines selected to complement the hyper-seasonal ingredients.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl italic font-serif text-accent">Timeless</h3>
              <p className="text-sm tracking-wide leading-relaxed">Puglian stone, warm lighting, and the scent of wild herbs. A space where time slows down.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
