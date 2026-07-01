"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Cinematic, letter-like storytelling.
 * Uses scroll progress to create an emotional, personal reveal.
 */
export default function Story() {
  const { scrollYProgress } = useScroll({
    target: { current: null }, // We'll let the section drive it naturally
  });

  const opacity1 = useTransform(scrollYProgress, [0.1, 0.35], [0.2, 1]);
  const y1 = useTransform(scrollYProgress, [0.1, 0.35], [40, 0]);

  return (
    <section id="story" className="section max-w-[860px] mx-auto px-6 pt-24 pb-28">
      <div className="text-center mb-16">
        <div className="uppercase tracking-[4px] text-[10px] text-[#A36A4E] mb-4">A FAMILY INVITATION</div>
        <h2 className="text-[58px] leading-none tracking-[-1.8px] font-medium">This is how we eat.</h2>
      </div>

      <div className="space-y-16 text-[17px] leading-[1.65] text-[#524A43]">
        <motion.div style={{ opacity: opacity1, y: y1 }} className="max-w-[640px]">
          Every morning Maria walks the market with a basket and no list. 
          She returns with whatever moved her — tomatoes still warm from the vine, fish that arrived before dawn, herbs that smell like the hills behind the house.
        </motion.div>

        <div className="grid md:grid-cols-12 gap-x-10 gap-y-8 text-[15px]">
          <div className="md:col-span-5 text-[#A36A4E] font-medium tracking-tight">Maria</div>
          <div className="md:col-span-7 leading-relaxed">
            She has never written a menu in her life. The table is set for whoever arrives that evening. 
            She cooks from memory and feeling. When the food is ready, it comes out.
          </div>

          <div className="md:col-span-5 text-[#A36A4E] font-medium tracking-tight pt-6 md:pt-0">Silve</div>
          <div className="md:col-span-7 leading-relaxed pt-6 md:pt-0">
            He opens the door. He pours the wine. He tells you what his mother made and why it matters today. 
            There is no rush. The evening unfolds the way evenings should.
          </div>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-[#D8D0C2] max-w-[620px]">
        <p className="text-[#524A43] italic text-[15px]">
          There are twelve seats. When they are taken, the door is closed. 
          We cook for the people who chose to sit with us that night.
        </p>
      </div>
    </section>
  );
}
