"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  { src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2070", caption: "The room at dusk" },
  { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070", caption: "Fresh pasta, made that morning" },
  { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070", caption: "What arrived from the sea" },
  { src: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2070", caption: "From the garden" },
  { src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1974", caption: "The table is always set simply" },
  { src: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=2070", caption: "Almond cake, always warm" },
];

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="gallery" className="section bg-[#F1EDE5] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-baseline justify-between mb-9">
          <div>
            <div className="text-xs tracking-[3px] text-[#A36A4E]">IN OUR HOME</div>
            <h4 className="text-5xl tracking-tight">A quiet evening</h4>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-[260px]">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="gallery-item relative overflow-hidden rounded-2xl bg-[#D8D0C2] aspect-video lg:aspect-auto"
              onClick={() => setActive(index)}
            >
              <img 
                src={image.src} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover" 
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-sm bg-gradient-to-t from-black/50">
                {image.caption}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full screen elegant modal */}
      <AnimatePresence>
        {active !== null && (
          <div 
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4" 
            onClick={() => setActive(null)}
          >
            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.985, opacity: 0 }}
              transition={{ ease: [0.21, 0.92, 0.3, 1], duration: 0.35 }}
              className="relative max-w-[1100px] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={images[active].src} 
                alt="" 
                className="w-full max-h-[84vh] object-contain rounded-3xl" 
              />
              <div className="text-center mt-5 text-white/70 text-sm tracking-widest">
                {images[active].caption}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
