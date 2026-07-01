"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Users, Leaf } from "lucide-react";

const principles = [
  {
    icon: Leaf,
    title: "What the Day Brings",
    desc: "Maria wakes early. She chooses. The menu is born from the garden, the fisherman’s basket, and what feels right that morning.",
  },
  {
    icon: Users,
    title: "Twelve Seats",
    desc: "Our table is small. We cook for no more than twelve guests each night. It feels like a private dinner among friends.",
  },
  {
    icon: Clock,
    title: "Time Moves Slowly",
    desc: "We do not rush courses. Wine is poured when it’s ready. Stories are told between plates. You leave when the night feels complete.",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section bg-[#f4efe6] py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="font-mono text-xs tracking-[4px] text-[#81746a] mb-3">THE RITUAL</div>
          <h2 className="font-serif text-5xl tracking-[-1.1px] leading-none text-[#2c2522]">Tonight at Our Table</h2>
          <p className="mt-5 max-w-md text-[#5c524b] text-[15px]">
            There is no menu to study. Only an invitation to be present and let the evening unfold.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {principles.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white/70 border border-[#d9d0c2] rounded-2xl px-8 py-9"
              >
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#2c2522] text-[#f9f5ed] mb-7">
                  <Icon size={18} />
                </div>
                <h3 className="font-serif text-[22px] leading-none tracking-tight mb-4 text-[#2c2522]">
                  {p.title}
                </h3>
                <p className="text-[#5c524b] leading-[1.65] text-[14.5px]">
                  {p.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-white border border-[#d9d0c2] rounded-full px-5 py-1 text-xs tracking-[2.5px] text-[#81746a]">
            ARRIVE BY 19:30. WE BEGIN TOGETHER.
          </div>
        </div>
      </div>
    </section>
  );
}
