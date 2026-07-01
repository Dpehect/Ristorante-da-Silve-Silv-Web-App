"use client";

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Dish3D from "./Dish3D";
import type { MenuData, Dish } from "@/lib/types";

const categories = [
  { id: "antipasti", label: "Antipasti" },
  { id: "primi", label: "Primi" },
  { id: "secondi", label: "Secondi" },
  { id: "dolci", label: "Dolci" },
];

// Elegant color mapping for 3D previews
const dishColors: Record<string, { color: string; secondary: string }> = {
  default: { color: '#a35f3f', secondary: '#4a5c3f' },
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
  const [hoveredDishId, setHoveredDishId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Load menu
  React.useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setMenu(res.data);
      });
  }, []);

  const currentDishes = menu?.categories.find((c) => c.id === activeCat)?.dishes || [];

  // Rich GSAP ScrollTrigger staggered reveal (cravburgers.shop energy + elegant Italian)
  useGSAP(() => {
    if (!cardsRef.current || !sectionRef.current) return;

    const cards = cardsRef.current.querySelectorAll(".dish-card");

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 68%",
      onEnter: () => {
        gsap.fromTo(
          cards,
          { 
            y: 110, 
            opacity: 0, 
            scale: 0.96,
            filter: "blur(6px)" 
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power3.out",
            stagger: 0.085,
          }
        );
      },
      once: true,
    });
  }, { scope: sectionRef });

  // Mouse tilt for 3D preview (shared for the hovered card)
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, dishId: string) => {
    if (hoveredDishId !== dishId) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    
    setMousePos({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
  };

  const handleCardMouseEnter = (dishId: string) => {
    setHoveredDishId(dishId);
    setMousePos({ x: 0, y: 0 });
  };

  const handleCardMouseLeave = () => {
    setHoveredDishId(null);
    setMousePos({ x: 0, y: 0 });
  };

  // Beautiful GSAP hover + 3D enhanced scale
  const handleHover = (e: React.MouseEvent<HTMLDivElement>, enter: boolean) => {
    const card = e.currentTarget;
    
    gsap.to(card, {
      scale: enter ? 1.015 : 1,
      y: enter ? -4 : 0,
      duration: 0.45,
      ease: "power2.out",
    });
  };

  // GSAP + state for elegant modal
  const openDish = (dish: Dish) => {
    setSelected(dish);
    
    requestAnimationFrame(() => {
      const modal = document.querySelector(".dish-modal");
      if (modal) {
        gsap.fromTo(
          modal,
          { y: 80, opacity: 0, scale: 0.985 },
          { 
            y: 0, 
            opacity: 1, 
            scale: 1, 
            duration: 0.7, 
            ease: "power3.out" 
          }
        );
      }
    });
  };

  const closeDish = () => {
    const modal = document.querySelector(".dish-modal");
    if (modal) {
      gsap.to(modal, {
        y: 60,
        opacity: 0,
        scale: 0.985,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => setSelected(null),
      });
    } else {
      setSelected(null);
    }
  };

  // Smooth GSAP category transition
  const changeCategory = (id: string) => {
    if (id === activeCat) return;

    const cards = cardsRef.current?.querySelectorAll(".dish-card");

    if (cards?.length) {
      gsap.to(cards, {
        opacity: 0,
        y: 25,
        duration: 0.28,
        ease: "power2.in",
        stagger: 0.03,
        onComplete: () => {
          setActiveCat(id);
          setHoveredDishId(null);
          
          // Re-animate new set
          requestAnimationFrame(() => {
            const newCards = cardsRef.current?.querySelectorAll(".dish-card");
            if (newCards) {
              gsap.fromTo(
                newCards,
                { opacity: 0, y: 40 },
                { 
                  opacity: 1, 
                  y: 0, 
                  duration: 0.75, 
                  ease: "power3.out", 
                  stagger: 0.06 
                }
              );
            }
          });
        },
      });
    } else {
      setActiveCat(id);
    }
  };

  const getDishColors = (dish: Dish) => {
    return dishColors[dish.id] || dishColors.default;
  };

  return (
    <section id="menu" ref={sectionRef} className="section max-w-6xl mx-auto px-6 py-24">
      <div className="flex flex-col items-center text-center mb-14">
        <span className="text-xs tracking-[4px] text-[#a35f3f] mb-3">THE LIVING TABLE</span>
        <h3 className="serif text-[62px] md:text-[72px] tracking-[-2.6px] leading-none">
          What we are serving
        </h3>
        <p className="mt-4 max-w-md text-[#5c5146] text-[15px]">
          Maria chooses in the morning. The menu changes with the light and the season.
        </p>
      </div>

      {/* Category Switcher — elegant pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-[#d9d0c1] pb-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => changeCategory(cat.id)}
            className={`menu-category px-8 py-3 text-sm tracking-[1.5px] transition-all ${
              activeCat === cat.id 
                ? "bg-[#2a211c] text-[#f8f4ed] shadow-sm" 
                : "bg-[#f0e9df] text-[#5c5146] hover:bg-[#e8dfcf]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Dish Grid with GSAP + 3D */}
      <div ref={cardsRef} className="grid md:grid-cols-2 gap-5">
        {currentDishes.map((dish) => {
          const colors = getDishColors(dish);
          const isHovered = hoveredDishId === dish.id;
          
          return (
            <div
              key={dish.id}
              onClick={() => openDish(dish)}
              onMouseEnter={(e) => {
                handleHover(e, true);
                handleCardMouseEnter(dish.id);
              }}
              onMouseLeave={(e) => {
                handleHover(e, false);
                handleCardMouseLeave();
              }}
              onMouseMove={(e) => handleCardMouseMove(e, dish.id)}
              className="dish-card group bg-[#f8f4ed] border border-[#d9d0c1] rounded-3xl p-7 md:p-8 flex flex-col md:flex-row gap-6 cursor-pointer overflow-hidden"
            >
              {/* 3D Preview — the star of the menu */}
              <div className="w-full md:w-[148px] h-[148px] md:h-[148px] flex-shrink-0 rounded-2xl overflow-hidden bg-[#e8dfcf] relative">
                <Dish3D 
                  color={colors.color} 
                  secondary={colors.secondary} 
                  mouseX={isHovered ? mousePos.x : 0} 
                  mouseY={isHovered ? mousePos.y : 0} 
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent pointer-events-none" />
              </div>

              <div className="flex-1 min-w-0 pt-1">
                <div className="dish-title serif text-[26px] tracking-[-0.6px] leading-none mb-1 transition-colors group-hover:text-[#a35f3f]">
                  {dish.nameIt}
                </div>
                <div className="text-[#8a7b6c] text-sm tracking-[-0.1px] mb-4">
                  {dish.nameEn}
                </div>

                <p className="text-[#5c5146] leading-[1.65] text-[14.8px] line-clamp-3 pr-2">
                  {dish.description}
                </p>

                {dish.note && (
                  <div className="mt-4 text-xs text-[#a35f3f] italic tracking-wide">
                    {dish.note}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* GSAP Powered Detail Modal */}
      {selected && (
        <div 
          className="fixed inset-0 z-[120] bg-black/80 flex items-center justify-center p-6" 
          onClick={closeDish}
        >
          <div 
            className="dish-modal bg-[#f8f4ed] rounded-3xl max-w-[820px] w-full p-10 md:p-14 relative shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={closeDish} 
              className="absolute top-8 right-8 text-[#8a7b6c] hover:text-[#a35f3f] text-sm tracking-widest"
            >
              CLOSE
            </button>

            <div className="flex flex-col md:flex-row gap-10">
              {/* Large 3D in modal */}
              <div className="w-full md:w-[260px] h-[260px] bg-[#e8dfcf] rounded-2xl overflow-hidden flex-shrink-0">
                <Dish3D 
                  color={getDishColors(selected).color} 
                  secondary={getDishColors(selected).secondary} 
                  mouseX={0.1} 
                  mouseY={-0.05} 
                />
              </div>

              <div className="flex-1">
                <div className="serif text-[48px] tracking-[-1.2px] leading-none mb-1">
                  {selected.nameIt}
                </div>
                <div className="text-[#a35f3f] text-lg tracking-tight mb-8">
                  {selected.nameEn}
                </div>

                <p className="text-[#5c5146] text-lg leading-[1.7]">
                  {selected.description}
                </p>

                {selected.note && (
                  <div className="mt-8 pl-6 border-l-2 border-[#a35f3f] text-[#a35f3f] italic text-[15px]">
                    {selected.note}
                  </div>
                )}

                <div className="mt-10 text-[10px] tracking-[3px] text-[#8a7b6c]">
                  SERVED WHEN READY • NO CHOICES
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
