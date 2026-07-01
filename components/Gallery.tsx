"use client";

import React, { useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const images = [
  { src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2070", caption: "The room at dusk" },
  { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070", caption: "Handmade pasta" },
  { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070", caption: "From the sea" },
  { src: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2070", caption: "Garden herbs" },
  { src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1974", caption: "Simple linen" },
  { src: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=2070", caption: "Almond cake" },
];

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  useGSAP(() => {
    const items = document.querySelectorAll(".gallery-item");
    gsap.from(items, {
      opacity: 0,
      y: 65,
      scale: 0.985,
      duration: 1.1,
      stagger: 0.09,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".gallery-grid",
        start: "top 72%",
      },
    });
  }, []);

  const open = (index: number) => {
    setActive(index);
    const modal = document.querySelector(".gallery-modal");
    if (modal) {
      gsap.fromTo(modal, { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" });
    }
  };

  const close = () => {
    const modal = document.querySelector(".gallery-modal");
    if (modal) {
      gsap.to(modal, {
        scale: 0.96,
        opacity: 0,
        duration: 0.3,
        onComplete: () => setActive(null),
      });
    } else {
      setActive(null);
    }
  };

  return (
    <section id="gallery" className="section bg-[#f0e9df] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <span className="text-xs tracking-[3.5px] text-[#a35f3f]">IN THE HOUSE</span>
          <h4 className="serif text-[52px] tracking-tight mt-2">A quiet evening</h4>
        </div>

        <div className="gallery-grid grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className="gallery-item relative aspect-[16/11] rounded-2xl overflow-hidden cursor-pointer group" 
              onClick={() => open(idx)}
            >
              <img src={img.src} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.06]" />
              <div className="absolute bottom-0 p-6 text-white text-sm bg-gradient-to-t from-black/70 w-full">
                {img.caption}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GSAP Modal */}
      {active !== null && (
        <div className="fixed inset-0 z-[130] bg-black/90 flex items-center justify-center p-5" onClick={close}>
          <div className="gallery-modal max-w-[1020px] w-full" onClick={e => e.stopPropagation()}>
            <img src={images[active].src} alt="" className="w-full max-h-[83vh] object-contain rounded-2xl shadow-2xl" />
            <p className="text-center text-white/70 mt-5 text-xs tracking-widest">{images[active].caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}
