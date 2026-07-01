"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const experiences = [
  {
    number: "01",
    title: "What the land gives us",
    desc: "Maria decides in the morning. The menu is born in her basket, never on paper.",
  },
  {
    number: "02",
    title: "Twelve people, one table",
    desc: "It never feels like a restaurant. It feels like dinner at the house of people you trust.",
  },
  {
    number: "03",
    title: "Time moves differently",
    desc: "Dishes arrive when they are ready. Conversations unfold between courses. You leave when the night feels complete.",
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const cards = sectionRef.current?.querySelectorAll(".exp-card");

    if (cards) {
      gsap.from(cards, {
        y: 110,
        opacity: 0,
        scale: 0.96,
        duration: 1.05,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
        },
      });

      // Subtle continuous hover lift on scroll enter
      cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { y: -6, duration: 0.4, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { y: 0, duration: 0.4, ease: "power2.out" });
        });
      });
    }
  }, { scope: sectionRef });

  return (
    <section id="experience" ref={sectionRef} className="section bg-[#f0e9df] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-lg mb-12">
          <span className="text-xs tracking-[3.5px] text-[#a35f3f]">THE RITUAL</span>
          <h3 className="serif text-[56px] tracking-[-1.8px] leading-none mt-3">Tonight at our table</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {experiences.map((item, index) => (
            <div 
              key={index} 
              className="exp-card bg-[#f8f4ed] border border-[#d9d0c1] rounded-3xl p-9 group"
            >
              <div className="text-[#a35f3f] text-xs tracking-[3px] mb-8">{item.number}</div>
              <h4 className="serif text-[24px] tracking-[-0.3px] leading-tight mb-4">{item.title}</h4>
              <p className="text-[#5c5146] text-[15px] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
