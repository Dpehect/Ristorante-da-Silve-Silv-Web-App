"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

export default function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Cinematic title scrub
    gsap.fromTo(titleRef.current, 
      { y: 90, opacity: 0.1 },
      {
        y: -20,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 78%",
          end: "top 25%",
          scrub: 1.1,
        }
      }
    );

    // Staggered rich reveals
    const blocks = contentRef.current?.querySelectorAll(".story-block");
    if (blocks) {
      gsap.from(blocks, {
        y: 70,
        opacity: 0,
        duration: 1.3,
        ease: "power2.out",
        stagger: 0.22,
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 70%",
        },
      });
    }
  }, { scope: sectionRef });

  return (
    <section id="story" ref={sectionRef} className="section max-w-[860px] mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <span className="text-xs tracking-[4.5px] text-[#a35f3f]">A FAMILY TABLE</span>
        <h2 ref={titleRef} className="serif text-[58px] md:text-[70px] tracking-[-2.4px] leading-none mt-4">
          This is how we live.
        </h2>
      </div>

      <div ref={contentRef} className="space-y-16 text-[17px] leading-[1.72] text-[#5c5146]">
        <div className="story-block">
          Every morning Maria walks the market with an empty basket. She returns with whatever moved her — tomatoes still warm from the vine, fish that arrived at dawn, herbs that smell like the hills.
        </div>

        <div className="grid md:grid-cols-2 gap-x-20 gap-y-12 text-[15.5px]">
          <div className="story-block">
            <span className="block text-[#a35f3f] text-xs tracking-[3px] mb-3">MARIA</span>
            She has never written a menu. The table receives whatever she chose that morning. She cooks with her hands and memory.
          </div>
          <div className="story-block">
            <span className="block text-[#a35f3f] text-xs tracking-[3px] mb-3">SILVE</span>
            He opens the door. He pours the wine slowly. He tells you why the dish matters today. Nothing is rushed.
          </div>
        </div>

        <div className="story-block pt-6 text-[21px] leading-tight text-[#3c2e25] max-w-[620px]">
          Only twelve seats. When they are taken, the door closes. We cook for those who chose to sit with us tonight.
        </div>
      </div>
    </section>
  );
}
