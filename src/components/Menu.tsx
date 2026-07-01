"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import menuData from "@/data/menu.json";

// Subtle WebGL hover effect for dishes
const hoverVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const hoverFragmentShader = `
uniform vec2 uMouse;
uniform float uTime;
uniform float uHoverState;
varying vec2 vUv;

void main() {
  vec2 center = vec2(0.5);
  float dist = distance(vUv, center);
  
  // Soft glow based on hover
  float alpha = smoothstep(0.5, 0.0, dist) * uHoverState * 0.15;
  
  // Add some noise or particle-like variance
  float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
  vec3 color = mix(vec3(0.54, 0.45, 0.33), vec3(0.96, 0.94, 0.90), noise * 0.5);
  
  gl_FragColor = vec4(color, alpha);
}
`;

function HoverEffect({ isHovered, mousePos }: { isHovered: boolean, mousePos: {x: number, y: number} }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      // Interpolate hover state for smooth transition
      const targetHover = isHovered ? 1.0 : 0.0;
      materialRef.current.uniforms.uHoverState.value += (targetHover - materialRef.current.uniforms.uHoverState.value) * 0.05;
      
      // Update mouse pos
      materialRef.current.uniforms.uMouse.value.set(
        (mousePos.x / window.innerWidth) * 2 - 1,
        -(mousePos.y / window.innerHeight) * 2 + 1
      );
    }
  });

  return (
    <mesh position={[0, 0, -1]} scale={[10, 10, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={hoverVertexShader}
        fragmentShader={hoverFragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uHoverState: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) }
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function Menu() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredDish, setHoveredDish] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray(".menu-category");
      
      sections.forEach((section: any) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
          y: 100,
          opacity: 0,
          duration: 1.5,
          ease: "power3.out"
        });

        const items = section.querySelectorAll(".menu-item");
        gsap.from(items, {
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "top 45%",
            scrub: 1,
          },
          y: 50,
          opacity: 0,
          stagger: 0.1,
          ease: "power2.out"
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen py-32 px-8 md:px-24 bg-secondary">
      {/* Global Canvas for WebGL Hover Effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 100 }}>
          <HoverEffect isHovered={hoveredDish !== null} mousePos={mousePos} />
        </Canvas>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-sm tracking-[0.3em] uppercase text-accent mb-4">The Offering</h2>
          <h3 className="text-4xl md:text-6xl font-light tracking-wide">La Nostra Cucina</h3>
        </div>

        <div className="space-y-32">
          {menuData.categories.map((category) => (
            <div key={category.name} className="menu-category">
              <h4 className="text-2xl italic font-serif text-primary/80 border-b border-accent/20 pb-4 mb-12">
                {category.name}
              </h4>
              <div className="space-y-12">
                {category.items.map((item) => (
                  <motion.div
                    key={item.id}
                    className="menu-item group cursor-pointer"
                    onMouseEnter={() => setHoveredDish(item.id)}
                    onMouseLeave={() => setHoveredDish(null)}
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                  >
                    <div className="flex justify-between items-baseline mb-2">
                      <h5 className="text-xl tracking-wider group-hover:text-accent transition-colors duration-500">
                        {item.name}
                      </h5>
                      <span className="text-accent/60 font-mono tracking-widest">{item.price}</span>
                    </div>
                    <p className="text-primary/50 text-sm tracking-wide max-w-2xl leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
