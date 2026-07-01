"use client";

import React from "react";
import { motion } from "framer-motion";

const storyCards = [
  {
    title: "Maria",
    role: "The Cook",
    text: "Every morning Maria walks the market and the garden. She never writes a menu. She simply cooks what moved her that day — the tomatoes that tasted like summer, the fish that arrived glistening, the herbs that smelled sweetest.",
    detail: "She has been cooking for people she loves for over thirty years.",
  },
  {
    title: "Silve",
    role: "The Host",
    text: "Silve welcomes you into their home like family. He sets the table, pours the wine, and tells you what his mother has prepared. There is never a rush. Only conversation, laughter, and plates that arrive when they are ready.",
    detail: "He remembers every guest’s name and how they take their coffee.",
  },
];

export default function Story() {
  return (
    <section id="story" className="section max-w-5xl mx-auto px-6 pt-20 pb-24">
      <div className="text-center mb-14">
        <div className="uppercase tracking-[3px] text-xs text-[#81746a] mb-3">A FAMILY TABLE</div>
        <h2 className="text-[#2c2522] text-5xl md:text-6xl font-medium tracking-[-1.2px] leading-none font-serif">
          This is our home.<br />You are our guests.
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {storyCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="card p-10 md:p-12 rounded-2xl flex flex-col"
          >
            <div>
              <div className="font-serif text-4xl tracking-tight text-[#2c2522]">{card.title}</div>
              <div className="text-[#c46b4e] tracking-[1px] text-sm font-medium mt-1">{card.role}</div>
            </div>
            
            <div className="mt-auto pt-9 text-[#5c524b] leading-[1.72] text-[15.2px]">
              {card.text}
            </div>
            
            <div className="mt-8 text-xs tracking-[0.5px] text-[#81746a] border-t border-[#d9d0c2] pt-4">
              {card.detail}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto text-center mt-16 text-[#5c524b] text-[15px] leading-relaxed">
        There is no printed menu. There are no categories decided months in advance. 
        Every evening we cook for the people who arrive, using what the land and sea gave us that morning. 
        You are simply invited to sit at our table.
      </div>
    </section>
  );
}
