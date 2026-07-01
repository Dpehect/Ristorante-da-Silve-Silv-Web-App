"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

const placeholderImages = [
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=2070&auto=format&fit=crop"
];

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const images = gsap.utils.toArray(".gallery-item");
      
      images.forEach((img: any, i) => {
        gsap.from(img, {
          scrollTrigger: {
            trigger: img,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
          y: 50,
          opacity: 0,
          scale: 0.95,
          duration: 1,
          ease: "power2.out",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 px-8 md:px-24 bg-secondary">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-sm tracking-[0.3em] uppercase text-accent mb-16 text-center">Visual Diary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {placeholderImages.map((src, idx) => (
            <motion.div
              key={idx}
              className="gallery-item cursor-pointer overflow-hidden aspect-[4/3] relative group"
              onClick={() => setSelectedImg(src)}
              whileHover={{ scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            >
              {/* Fallback styling for images - using regular div with background since we don't have next/image setup for remote domains */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: `url(${src})` }}
              />
              <div className="absolute inset-0 bg-secondary/20 group-hover:bg-transparent transition-colors duration-700" />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/95 backdrop-blur-md cursor-zoom-out p-8"
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              src={selectedImg}
              alt="Gallery Preview"
              className="max-w-full max-h-full object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
