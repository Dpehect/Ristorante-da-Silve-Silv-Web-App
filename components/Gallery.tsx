"use client";

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const images = [
  { src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2070", caption: "The dining room at dusk" },
  { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070", caption: "Handmade pasta" },
  { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070", caption: "From the Adriatic" },
  { src: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2070", caption: "Garden herbs" },
  { src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1974", caption: "Simple table" },
  { src: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=2070", caption: "Almond & ricotta" },
];

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = gridRef.current?.querySelectorAll(".gallery-item");
    if (items) {
      gsap.from(items, {
        opacity: 0,
        y: 70,
        scale: 0.985,
        duration: 1.05,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 75%",
        },
      });
    }
  }, []);

  const open = (index: number) => {
    setActive(index);
    const modalContent = document.querySelector(".gallery-modal-content");
    if (modalContent) {
      gsap.fromTo(modalContent, { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "power2.out" });
    }
  };

  const close = () => {
    const modalContent = document.querySelector(".gallery-modal-content");
    if (modalContent) {
      gsap.to(modalContent, {
        scale: 0.97,
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
          <h4 className="serif text-[48px] tracking-tight mt-1">A quiet evening</h4>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="gallery-item aspect-[16/10] relative cursor-pointer" onClick={() => open(idx)}>
              <img src={img.src} alt={img.caption} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute bottom-0 p-6 text-white text-sm bg-gradient-to-t from-black/60 w-full">{img.caption}</div>
            </div>
          ))}
        </div>
      </div>

      {/* GSAP Modal */}
      {active !== null && (
        <div className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-6" onClick={close}>
          <div className="gallery-modal-content max-w-[1080px] w-full" onClick={(e) => e.stopPropagation()}>
            <img src={images[active].src} alt="" className="w-full max-h-[82vh] object-contain rounded-2xl" />
            <p className="text-center text-white/70 mt-5 text-sm tracking-widest">{images[active].caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}
