"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const experiences = [
  {
    number: "01",
    title: "What the land gives us",
    desc: "Maria decides in the morning. The menu is born in her basket, never on a piece of paper.",
  },
  {
    number: "02",
    title: "Twelve people, one table",
    desc: "It never feels like a restaurant. It feels like dinner at the house of people you already like.",
  },
  {
    number: "03",
    title: "Time moves differently here",
    desc: "Dishes arrive when they are ready. Conversations flow between courses. You leave when the night feels complete.",
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const cards = sectionRef.current?.querySelectorAll(".exp-card");

    if (cards) {
      gsap.from(cards, {
        y: 90,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.14,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    }
  }, { scope: sectionRef });

  return (
    <section id="experience" ref={sectionRef} className="section bg-[#f0e9df] py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="max-w-md mb-12">
          <span className="text-xs tracking-[3.5px] text-[#a35f3f]">THE EVENING</span>
          <h3 className="serif text-[52px] tracking-[-1.6px] leading-none mt-3">Tonight at our table</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {experiences.map((item, i) => (
            <div key={i} className="exp-card bg-[#f8f4ed] rounded-3xl p-9 border border-[#d9d0c1]">
              <div className="text-[#a35f3f] text-xs tracking-[3px] mb-8">{item.number}</div>
              <h4 className="serif text-[26px] tracking-tight mb-4 leading-none">{item.title}</h4>
              <p className="text-[#5c5146] leading-relaxed text-[15px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
