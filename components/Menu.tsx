"use client";

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { MenuData, Dish } from "@/lib/types";

const categories = [
  { id: "antipasti", label: "Antipasti" },
  { id: "primi", label: "Primi" },
  { id: "secondi", label: "Secondi" },
  { id: "dolci", label: "Dolci" },
];

export default function Menu() {
  const [activeCat, setActiveCat] = useState("antipasti");
  const [selected, setSelected] = useState<Dish | null>(null);
  const [menu, setMenu] = useState<MenuData | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Load menu from JSON API
  React.useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setMenu(res.data);
      });
  }, []);

  const currentDishes = menu?.categories.find((c) => c.id === activeCat)?.dishes || [];

  // GSAP: Staggered entry when section enters view (cravburgers.shop energy)
  useGSAP(() => {
    if (!cardsRef.current || !sectionRef.current) return;

    const cards = cardsRef.current.querySelectorAll(".dish-card");

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 65%",
      onEnter: () => {
        gsap.fromTo(
          cards,
          { y: 80, opacity: 0, scale: 0.985 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "power2.out",
            stagger: 0.07,
          }
        );
      },
      once: true,
    });
  }, { scope: sectionRef });

  // GSAP Hover animation
  const handleHover = (e: React.MouseEvent<HTMLDivElement>, enter: boolean) => {
    const card = e.currentTarget;
    const title = card.querySelector(".dish-title");

    gsap.to(card, {
      scale: enter ? 1.01 : 1,
      duration: 0.4,
      ease: "power2.out",
    });

    if (title) {
      gsap.to(title, {
        x: enter ? 6 : 0,
        duration: 0.35,
        ease: "power1.out",
      });
    }
  };

  // GSAP animated detail open
  const openDish = (dish: Dish) => {
    setSelected(dish);

    // Animate modal in with GSAP
    requestAnimationFrame(() => {
      const modal = document.querySelector(".dish-modal");
      if (modal) {
        gsap.fromTo(
          modal,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: "power2.out" }
        );
      }
    });
  };

  const closeDish = () => {
    const modal = document.querySelector(".dish-modal");
    if (modal) {
      gsap.to(modal, {
        y: 50,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => setSelected(null),
      });
    } else {
      setSelected(null);
    }
  };

  // Smooth category change - simple state update (grid will re-render with new dishes)
  const changeCategory = (id: string) => {
    if (id === activeCat) return;
    setActiveCat(id);
  };

  return (
    <section id="menu" ref={sectionRef} className="section max-w-6xl mx-auto px-6 py-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-11 gap-y-4">
        <div>
          <span className="text-xs tracking-[3.5px] text-[#a35f3f]">THE TABLE TONIGHT</span>
          <h3 className="serif text-[58px] tracking-[-1.8px] leading-none mt-1">What we are serving</h3>
        </div>
        <div className="text-[#a35f3f] text-sm">Maria cooks what moved her today</div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-10 border-b border-[#d9d0c1] pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => changeCategory(cat.id)}
            className={`menu-category ${activeCat === cat.id ? "active" : "bg-[#f0e9df] text-[#5c5146]"}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Dish Grid with scroll-triggered stagger */}
      <div ref={cardsRef} className="grid md:grid-cols-2 gap-4">
        {currentDishes.map((dish) => (
          <div
            key={dish.id}
            onClick={() => openDish(dish)}
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
            className="dish-card p-8 md:p-9 flex flex-col"
          >
            <div className="dish-content flex-1">
              <div className="dish-title serif text-[26px] tracking-[-0.4px] leading-none mb-1.5">
                {dish.nameIt}
              </div>
              <div className="text-[#8a7b6c] text-sm mb-5 tracking-tight">{dish.nameEn}</div>
              <p className="text-[#5c5146] leading-[1.65] text-[15px] pr-2">
                {dish.description}
              </p>
            </div>

            {dish.note && <div className="text-[#a35f3f] text-xs mt-6 italic tracking-wide">{dish.note}</div>}
          </div>
        ))}
      </div>

      {/* GSAP Animated Dish Detail */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onClick={closeDish}>
          <div
            className="dish-modal dish-detail w-full max-w-[620px] p-10 md:p-12 text-[#2a211c] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeDish} className="absolute top-9 right-9 text-[#8a7b6c] hover:text-[#a35f3f]">Close</button>

            <div className="serif text-[42px] tracking-[-1px] leading-none mb-2">{selected.nameIt}</div>
            <div className="text-[#a35f3f] mb-8">{selected.nameEn}</div>

            <p className="text-lg leading-relaxed text-[#5c5146]">{selected.description}</p>

            {selected.note && (
              <div className="mt-10 border-l-2 border-[#a35f3f] pl-6 text-[#a35f3f] italic">
                {selected.note}
              </div>
            )}

            <div className="mt-12 text-xs text-[#8a7b6c] tracking-[2px]">SERVED WHEN IT IS READY</div>
          </div>
        </div>
      )}
    </section>
  );
}
