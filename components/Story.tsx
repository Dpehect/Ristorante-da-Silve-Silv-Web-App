"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

export default function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Title reveal - guard against null ref during hydration/mount
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          y: 80,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 75%",
          },
        });
      }

      // Staggered paragraph reveals — cravburgers.shop style
      const paras = paragraphsRef.current?.querySelectorAll("p, .story-block");
      if (paras && paragraphsRef.current) {
        gsap.from(paras, {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: "power2.out",
          stagger: 0.18,
          scrollTrigger: {
            trigger: paragraphsRef.current,
            start: "top 72%",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="story" ref={sectionRef} className="section max-w-[820px] mx-auto px-6 pt-20 pb-24">
      <div className="text-center mb-16">
        <span className="text-xs tracking-[4px] text-[#a35f3f]">A FAMILY TABLE</span>
        <h2 ref={titleRef} className="serif text-[56px] md:text-[68px] tracking-[-2.2px] leading-none mt-3">
          This is how<br />we live.
        </h2>
      </div>

      <div ref={paragraphsRef} className="space-y-14 text-lg md:text-[17.5px] leading-[1.72] text-[#5c5146]">
        <div className="story-block">
          Every morning Maria walks to the market with an empty basket and an open heart. She buys what speaks to her — the sweetest tomatoes, the fish that just arrived, the herbs that smell like the hills behind our house.
        </div>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-10 pt-6">
          <div className="story-block">
            <span className="block text-[#a35f3f] text-sm tracking-widest mb-2">MARIA</span>
            She has never written a menu. The food that arrives on the table is whatever moved her that day. She cooks with her hands and her memory.
          </div>
          <div className="story-block">
            <span className="block text-[#a35f3f] text-sm tracking-widest mb-2">SILVE</span>
            He opens the door. He pours the wine slowly. He tells you the story behind every plate. Nothing is rushed here.
          </div>
        </div>

        <div className="story-block pt-8 text-xl md:text-2xl text-[#3c2e25] leading-tight max-w-[620px]">
          There are only twelve seats. When they are full, we close the door. We cook for the people who chose to sit with us tonight.
        </div>
      </div>
    </section>
  );
}
