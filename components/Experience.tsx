"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Users, Leaf } from "lucide-react";

const principles = [
  {
    icon: Leaf,
    title: "What the morning brings",
    description: "Maria decides when she returns from the market. The menu is born in the basket, not on paper.",
  },
  {
    icon: Users,
    title: "Twelve guests only",
    description: "We keep the table small. It never feels like a restaurant. It feels like a dinner among old friends.",
  },
  {
    icon: Clock,
    title: "Time is not hurried",
    description: "Courses arrive when they are ready. Stories are told between plates. You leave when the night feels complete.",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section bg-[#F1EDE5] py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="text-xs tracking-[3px] text-[#A36A4E] mb-3">THE EVENING</div>
          <h3 className="text-6xl tracking-[-1.4px] leading-none">Tonight at our table</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {principles.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div 
                key={index}
                whileHover={{ y: -3 }}
                className="card p-9 group"
              >
                <div className="w-11 h-11 rounded-full bg-[#1C1714] text-[#F7F4EE] flex items-center justify-center mb-9">
                  <Icon size={19} />
                </div>
                <h4 className="text-2xl tracking-tight mb-4">{item.title}</h4>
                <p className="text-[#524A43] leading-[1.65] text-[15px]">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
