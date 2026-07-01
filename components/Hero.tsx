"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!heroRef.current) return;

    // Strong but elegant background parallax (cravburgers style + warmth)
    gsap.to(bgRef.current, {
      yPercent: 22,
      scale: 1.08,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.6,
      },
    });

    // Title + subtitle scrub + fade
    gsap.to(titleRef.current, {
      y: 70,
      opacity: 0.35,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "55% top",
        scrub: 1,
      },
    });

    gsap.to(subtitleRef.current, {
      y: 45,
      opacity: 0.2,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "45% top",
        scrub: 1.2,
      },
    });
  }, { scope: heroRef });

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative h-[100dvh] min-h-[860px] flex items-center justify-center overflow-hidden"
    >
      {/* Cinematic hero image with GSAP parallax */}
      <div 
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2070&auto=format&fit=crop')",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/55 to-black/75" />
      <div className="absolute inset-0 bg-[radial-gradient(#f8f4ed_0.6px,transparent_1px)] bg-[length:3px_3px] opacity-10" />

      <div className="relative z-10 text-center px-6 max-w-[980px]">
        <div className="uppercase text-[#f8f4ed]/60 text-xs tracking-[5px] mb-5">FASANO • PUGLIA</div>

        <h1 ref={titleRef} className="serif text-white text-[100px] md:text-[128px] leading-[.82] tracking-[-6.2px] font-medium mb-7">
          da Silve
        </h1>

        <p ref={subtitleRef} className="text-white/85 text-[21px] md:text-[26px] max-w-md mx-auto font-serif tracking-[-0.2px]">
          A table at home.<br />Only what the day brings.
        </p>

        <button 
          onClick={() => document.getElementById('reserve')?.scrollIntoView({ behavior: 'smooth' })}
          className="mt-12 btn btn-primary px-11 py-[17px] text-[15px] tracking-[1.5px]"
        >
          RESERVE YOUR PLACE
        </button>
      </div>

      <div className="absolute bottom-14 text-white/50 text-xs tracking-[3px]">SCROLL TO BEGIN THE EVENING</div>
    </section>
  );
}
