"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  caption: string;
}

// Beautiful curated images evoking the restaurant
const images: GalleryImage[] = [
  { id: 1, src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop", alt: "Intimate dining room", caption: "The dining room at dusk" },
  { id: 2, src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop", alt: "Beautiful pasta plate", caption: "Orecchiette, just made" },
  { id: 3, src: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop", alt: "Garden herbs", caption: "Maria’s herbs from the garden" },
  { id: 4, src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop", alt: "Fresh fish", caption: "The day’s catch" },
  { id: 5, src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1974&auto=format&fit=crop", alt: "Table setting", caption: "Simple linen and terracotta" },
  { id: 6, src: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=2070&auto=format&fit=crop", alt: "Dessert plate", caption: "Ricotta almond cake" },
];

export default function Gallery() {
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  const open = (img: GalleryImage) => setSelected(img);
  const close = () => setSelected(null);

  return (
    <section id="gallery" className="section bg-[#f4efe6] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="font-mono uppercase tracking-[3px] text-xs text-[#81746a]">IN THE HOUSE</div>
            <h2 className="font-serif text-5xl tracking-tight mt-1 text-[#2c2522]">A Sense of Home</h2>
          </div>
          <p className="hidden md:block text-sm text-[#5c524b] max-w-xs">These are not staged photographs. This is how it feels when you are here.</p>
        </div>

        {/* Elegant masonry-inspired grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-[minmax(200px,auto)]">
          {images.map((image, idx) => (
            <div 
              key={image.id} 
              onClick={() => open(image)}
              className={`group relative overflow-hidden rounded-2xl bg-[#d9d0c2] ${idx % 3 === 1 ? "lg:row-span-2" : ""}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="gallery-img absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/60" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div className="text-sm tracking-wide font-light">{image.caption}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-screen elegant modal */}
      <AnimatePresence>
        {selected && (
          <div 
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4" 
            onClick={close}
          >
            <motion.div 
              className="modal relative max-w-[1080px] w-full"
              initial={{ opacity: 0, scale: 0.985, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.99, y: 10 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={close} 
                className="absolute -top-3 -right-3 z-10 bg-white text-[#2c2522] p-3 rounded-full shadow"
                aria-label="Close image"
              >
                <X size={18} />
              </button>

              <div className="overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src={selected.src} 
                  alt={selected.alt} 
                  className="w-full h-auto max-h-[82vh] object-contain bg-black" 
                />
              </div>
              <div className="text-center mt-4 text-[#f4efe6] text-sm tracking-widest">
                {selected.caption}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
