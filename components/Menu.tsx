"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { MenuData, Dish } from "@/lib/types";

// We will fetch live from API
const categories = [
  { id: "antipasti", label: "Antipasti" },
  { id: "primi", label: "Primi" },
  { id: "secondi", label: "Secondi" },
  { id: "dolci", label: "Dolci" },
];

/**
 * Elegant 3D Tilt Card
 * Uses Framer Motion values for buttery mouse-follow tilt.
 * Feels expensive and hand-crafted.
 */
function TiltDishCard({ 
  dish, 
  onClick 
}: { 
  dish: Dish; 
  onClick: () => void;
}) {
  const [rotateX, setRotateX] = React.useState(0);
  const [rotateY, setRotateY] = React.useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotX = -y * 7; // subtle tilt
    const rotY = x * 9;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const resetTilt = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      whileHover={{ scale: 1.005 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      transition={{ type: "spring", stiffness: 180, damping: 24 }}
      className="dish-card p-8 md:p-9 flex flex-col h-full"
    >
      <div className="flex-1">
        <div className="font-serif text-[23px] leading-none tracking-[-0.4px] mb-1">
          {dish.nameIt}
        </div>
        <div className="text-[#7A6F64] text-[13px] tracking-tight mb-4">
          {dish.nameEn}
        </div>
        <p className="text-[#524A43] leading-[1.65] text-[14.5px] pr-4">
          {dish.description}
        </p>
      </div>

      {dish.note && (
        <div className="mt-auto pt-6 text-xs text-[#A36A4E] italic tracking-wide">
          {dish.note}
        </div>
      )}

      <div className="mt-5 flex gap-2">
        {dish.diet.includes("vegetarian") && (
          <div className="text-[10px] px-3 py-px rounded-full bg-[#475C3A]/10 text-[#475C3A]">Vegetarian</div>
        )}
        {dish.diet.includes("seafood") && (
          <div className="text-[10px] px-3 py-px rounded-full bg-[#4A6B7F]/10 text-[#4A6B7F]">Seafood</div>
        )}
      </div>
    </motion.div>
  );
}

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("antipasti");
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch live menu from JSON API
  React.useEffect(() => {
    async function loadMenu() {
      try {
        const res = await fetch("/api/menu");
        const json = await res.json();
        if (json.success) setMenuData(json.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  const currentCategory = menuData?.categories.find((c) => c.id === activeCategory);

  return (
    <section id="menu" className="section max-w-6xl mx-auto px-6 pt-20 pb-28">
      <div className="flex flex-col items-center mb-12">
        <div className="text-[#A36A4E] text-xs tracking-[3px] mb-2">THE TABLE TONIGHT</div>
        <h3 className="text-center text-[62px] tracking-[-1.8px] leading-none">What we are serving</h3>
      </div>

      {/* Beautiful category switcher */}
      <div className="flex justify-center mb-14">
        <div className="category-switch">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={activeCategory === cat.id ? "active" : ""}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 rounded-3xl bg-white/60 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <AnimatePresence mode="wait">
            {currentCategory?.dishes.map((dish, index) => (
              <TiltDishCard 
                key={dish.id} 
                dish={dish} 
                onClick={() => setSelectedDish(dish)} 
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Dish Detail Modal — luxurious and intimate */}
      <AnimatePresence>
        {selectedDish && (
          <div className="fixed inset-0 bg-black/70 z-[80] flex items-center justify-center p-5" onClick={() => setSelectedDish(null)}>
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.985 }}
              transition={{ ease: [0.21, 0.92, 0.3, 1], duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="dish-detail w-full max-w-[640px] p-10 md:p-14 relative"
            >
              <button onClick={() => setSelectedDish(null)} className="absolute top-8 right-8 text-[#7A6F64]">
                <X size={21} />
              </button>

              <div className="font-serif text-[42px] leading-none tracking-[-1.1px] mb-2">
                {selectedDish.nameIt}
              </div>
              <div className="text-[#A36A4E] tracking-tight mb-8">{selectedDish.nameEn}</div>

              <div className="text-[15.5px] leading-[1.75] text-[#524A43] pr-4">
                {selectedDish.description}
              </div>

              {selectedDish.note && (
                <div className="mt-9 border-l-2 pl-5 border-[#A36A4E]/30 text-[#A36A4E] text-sm tracking-wide italic">
                  {selectedDish.note}
                </div>
              )}

              <div className="mt-12 text-xs uppercase tracking-[2px] text-[#7A6F64]">
                Served when it is ready
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
