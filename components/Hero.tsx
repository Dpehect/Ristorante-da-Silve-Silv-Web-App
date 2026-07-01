"use client";

import React from "react";
import { motion } from "framer-motion";
import ThreeHeroBackground from "./ThreeHeroBackground";

export default function Hero() {
  const scrollToStory = () => {
    document.getElementById("story")?.scrollIntoView({ 
      behavior: "smooth", 
      block: "start" 
    });
  };

  return (
    <section id="hero" className="relative h-[100dvh] min-h-[860px] flex items-center justify-center overflow-hidden">
      {/* Cinematic WebGL Background — subtle olive light */}
      <ThreeHeroBackground />

      {/* Warm atmospheric gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#F7F4EE_30%,transparent_70%)] opacity-60 z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/45 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-[920px]">
        <div className="mb-6">
          <div className="inline-block px-4 py-1 rounded-full border border-white/30 text-white/70 text-[10px] tracking-[3px] mb-6 font-mono">
            FASANO • PUGLIA
          </div>
        </div>

        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.21, 0.92, 0.3, 1] }}
          className="text-white text-[92px] md:text-[108px] leading-[0.86] font-medium tracking-[-4.4px] mb-6"
        >
          da Silve
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1.1, ease: [0.21, 0.92, 0.3, 1] }}
          className="text-white/90 text-[21px] md:text-2xl tracking-[-0.2px] max-w-md mx-auto mb-12 font-serif"
        >
          A private table in the heart of Puglia.<br />No menu. Just what the day brings.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <button
            onClick={() => document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" })}
            className="btn btn-primary px-10 py-[17px] text-base tracking-[0.01em] bg-white text-[#1C1714] hover:bg-[#A36A4E] hover:text-white"
          >
            Reserve your place
          </button>
        </motion.div>
      </div>

      {/* Elegant scroll prompt */}
      <button 
        onClick={scrollToStory}
        className="absolute bottom-12 left-1/2 z-20 flex flex-col items-center text-white/60 hover:text-white/90 text-xs tracking-[2.5px] transition-colors"
      >
        SCROLL TO BEGIN
        <div className="mt-3 h-px w-8 bg-white/40" />
      </button>
    </section>
  );
}
