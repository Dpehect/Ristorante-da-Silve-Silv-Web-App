"use client";

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";
import Dish3D from "./Dish3D";
import type { MenuData, Dish } from "@/lib/types";

const categories = [
  { id: "antipasti", label: "Antipasti" },
  { id: "primi", label: "Primi" },
  { id: "secondi", label: "Secondi" },
  { id: "dolci", label: "Dolci" },
];

const dishVisuals: Record<string, { color: string; secondary: string }> = {
  default: { color: '#b76e4a', secondary: '#4a5c3f' },
  a1: { color: '#c46b4e', secondary: '#5f6f4e' },
  a2: { color: '#5a7a8f', secondary: '#a35f3f' },
  p1: { color: '#8c6f4d', secondary: '#5f6f4e' },
  p2: { color: '#d4b48c', secondary: '#4a5c3f' },
  s1: { color: '#8b4d3f', secondary: '#5a3f2e' },
  d1: { color: '#c9a16f', secondary: '#6b5c3f' },
};

export default function Menu() {
  const [activeCat, setActiveCat] = useState("antipasti");
  const [selected, setSelected] = useState<Dish | null>(null);
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    fetch("/api/menu").then(r => r.json()).then(res => {
      if (res.success) setMenu(res.data);
    });
  }, []);

  const currentDishes = menu?.categories.find(c => c.id === activeCat)?.dishes || [];

  // Cinematic GSAP ScrollTrigger entry for the entire menu
  useGSAP(() => {
    const cards = gridRef.current?.querySelectorAll('.dish-card');
    if (!cards || !sectionRef.current) return;

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 60%",
      onEnter: () => {
        gsap.fromTo(cards, 
          { y: 120, opacity: 0, rotateX: 8, filter: 'blur(8px)' },
          { 
            y: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)', 
            duration: 1.15, 
            ease: "power3.out", 
            stagger: { amount: 0.6, from: "start" } 
          }
        );
      },
      once: true
    });
  }, { scope: sectionRef });

  const getVisual = (dish: Dish) => dishVisuals[dish.id] || dishVisuals.default;

  const handleMouseMove = (e: React.MouseEvent, id: string) => {
    if (hoveredId !== id) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x: x * 0.6, y: y * -0.6 });
  };

  const openDish = (dish: Dish) => {
    setSelected(dish);
    // Cinematic entry
    setTimeout(() => {
      const el = document.querySelector('.cinematic-modal');
      if (el) gsap.fromTo(el, { y: 90, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" });
    }, 10);
  };

  const closeDish = () => {
    const el = document.querySelector('.cinematic-modal');
    if (el) {
      gsap.to(el, { y: 70, opacity: 0, scale: 0.98, duration: 0.5, ease: "power2.in", onComplete: () => setSelected(null) });
    } else {
      setSelected(null);
    }
  };

  const changeCategory = (id: string) => {
    if (id === activeCat) return;
    const cards = gridRef.current?.querySelectorAll('.dish-card');
    
    gsap.to(cards || [], { opacity: 0, y: 30, duration: 0.3, stagger: 0.04, onComplete: () => {
      setActiveCat(id);
      setHoveredId(null);
      setTilt({ x: 0, y: 0 });
      
      setTimeout(() => {
        const newCards = gridRef.current?.querySelectorAll('.dish-card');
        gsap.fromTo(newCards || [], 
          { opacity: 0, y: 50 }, 
          { opacity: 1, y: 0, duration: 0.85, stagger: 0.05, ease: "power3.out" }
        );
      }, 60);
    }});
  };

  return (
    <section id="menu" ref={sectionRef} className="section max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-14">
        <div className="text-[#a35f3f] text-xs tracking-[4px] mb-2">THE EVENING'S OFFERING</div>
        <h2 className="serif text-6xl tracking-tight">What arrived today</h2>
      </div>

      <div className="flex justify-center gap-2 mb-10 flex-wrap">
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => changeCategory(cat.id)}
            className={`px-7 py-2.5 rounded-full text-sm tracking-widest transition-all border ${activeCat === cat.id ? 'bg-[#2a211c] text-[#f8f4ed] border-[#2a211c]' : 'border-[#d9d0c1] hover:bg-[#f0e9df]'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div ref={gridRef} className="grid md:grid-cols-2 gap-6">
        {currentDishes.map((dish, index) => {
          const visuals = getVisual(dish);
          const isActive = hoveredId === dish.id;
          
          return (
            <div 
              key={dish.id}
              onClick={() => openDish(dish)}
              onMouseEnter={() => setHoveredId(dish.id)}
              onMouseLeave={() => { setHoveredId(null); setTilt({x:0,y:0}); }}
              onMouseMove={(e) => handleMouseMove(e, dish.id)}
              className="dish-card group bg-[#f8f4ed] border border-[#d9d0c1] rounded-3xl p-8 flex flex-col md:flex-row gap-7 overflow-hidden cursor-pointer"
            >
              {/* 3D + Shader Preview */}
              <div className="w-[155px] h-[155px] flex-shrink-0 rounded-2xl overflow-hidden bg-[#e8dfcf] relative">
                <Dish3D 
                  color={visuals.color} 
                  secondary={visuals.secondary} 
                  mouseX={isActive ? tilt.x : 0} 
                  mouseY={isActive ? tilt.y : 0} 
                />
              </div>

              <div className="flex-1 pt-1">
                <div className="text-3xl font-serif tracking-tight leading-none mb-1 group-hover:text-[#a35f3f] transition-colors">
                  {dish.nameIt}
                </div>
                <div className="text-sm text-[#8a7b6c] mb-5 tracking-tight">{dish.nameEn}</div>
                <p className="text-[#5c5146] leading-relaxed text-[15px] line-clamp-3">{dish.description}</p>
                
                {dish.note && <div className="text-xs mt-5 text-[#a35f3f] italic">{dish.note}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cinematic Detail View with GSAP + Framer Motion */}
      <AnimatePresence>
        {selected && (
          <div 
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-6" 
            onClick={closeDish}
          >
            <motion.div 
              className="cinematic-modal bg-[#f8f4ed] rounded-3xl max-w-4xl w-full p-10 md:p-14 relative"
              initial={{ opacity: 0, y: 80, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.97 }}
              transition={{ duration: 0.6, ease: [0.21, 0.92, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={closeDish} className="absolute top-8 right-8 text-sm tracking-widest text-[#8a7b6c]">CLOSE</button>

              <div className="grid md:grid-cols-5 gap-10 items-center">
                <div className="md:col-span-2 aspect-square bg-[#e8dfcf] rounded-2xl overflow-hidden">
                  <Dish3D 
                    color={getVisual(selected).color} 
                    secondary={getVisual(selected).secondary} 
                    mouseX={0.15} 
                    mouseY={-0.1} 
                  />
                </div>

                <div className="md:col-span-3">
                  <div className="text-[42px] serif tracking-tight leading-none mb-2">{selected.nameIt}</div>
                  <div className="text-[#a35f3f] tracking-tight mb-8">{selected.nameEn}</div>
                  <p className="text-lg leading-relaxed text-[#5c5146]">{selected.description}</p>

                  {selected.note && (
                    <div className="mt-9 pl-6 border-l-2 border-[#a35f3f] text-[#a35f3f] italic">{selected.note}</div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
