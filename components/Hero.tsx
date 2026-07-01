"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  const scrollToReserve = () => {
    const el = document.getElementById("reserve");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="hero" className="relative h-[100dvh] min-h-[720px] flex items-center justify-center overflow-hidden">
      {/* Cinematic background image — warm Puglia feel */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2070&auto=format&fit=crop')`,
        }}
      />
      
      {/* Warm, soft overlay for intimacy */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/50" />
      <div className="absolute inset-0 bg-[radial-gradient(#f9f5ed_0.6px,transparent_1px)] bg-[length:4px_4px] opacity-10" />

      {/* Hero Content — personal invitation */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <div className="uppercase tracking-[4px] text-[#f4efe6]/90 text-xs mb-4 font-mono">FASANO • PUGLIA</div>
        
        <h1 className="serif-display text-white text-7xl md:text-[5.75rem] leading-[0.96] tracking-[-1.6px] font-medium mb-5">
          da Silve
        </h1>
        
        <p className="text-[#f4efe6] text-2xl md:text-[28px] tracking-[-0.2px] font-light max-w-md mx-auto mb-9 font-serif">
          A table at home in Fasano
        </p>

        <button
          onClick={scrollToReserve}
          className="group inline-flex items-center gap-3 rounded-full bg-white/95 hover:bg-white px-9 py-4 text-base tracking-[0.015em] font-medium text-[#2c2522] transition-all active:scale-[0.985]"
        >
          Reserve Your Place
          <span className="transition group-hover:translate-x-0.5">→</span>
        </button>
      </div>

      {/* Delicate scroll indicator */}
      <button 
        onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[#f9f5ed]/70 hover:text-[#f9f5ed] transition-colors text-xs tracking-[2px] font-mono"
      >
        SCROLL TO BEGIN
        <ArrowDown size={16} className="scroll-indicator" />
      </button>
    </section>
  );
}
