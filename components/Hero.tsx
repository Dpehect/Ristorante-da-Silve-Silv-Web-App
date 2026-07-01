"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!heroRef.current || !bgRef.current || !contentRef.current) return;

    // Subtle parallax on background image + content on scroll
    gsap.to(bgRef.current, {
      yPercent: 18,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    // Elegant content fade + slight scale on scroll
    gsap.to(contentRef.current, {
      opacity: 0.6,
      y: 60,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "60% top",
        scrub: 1,
      },
    });
  }, { scope: heroRef });

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative h-[100dvh] min-h-[820px] flex items-center justify-center overflow-hidden"
    >
      {/* Cinematic Background Image */}
      <div 
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2070&auto=format&fit=crop')",
          willChange: 'transform'
        }}
      />

      {/* Warm overlay layers for intimacy */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/45 to-black/65" />
      <div className="absolute inset-0 bg-[radial-gradient(#f8f4ed_0.5px,transparent_1px)] bg-[length:4px_4px] opacity-[0.06]" />

      {/* Hero Content */}
      <div ref={contentRef} className="relative z-10 text-center px-6 max-w-4xl">
        <div className="mb-4">
          <span className="font-mono tracking-[4px] text-sm text-white/70">FASANO, PUGLIA</span>
        </div>

        <h1 className="serif text-white text-[92px] md:text-[110px] leading-[.86] tracking-[-5.2px] font-medium mb-6">
          da Silve
        </h1>

        <p className="text-white/90 text-2xl md:text-[26px] tracking-[-0.3px] max-w-md mx-auto font-serif mb-12">
          A table at home.<br />Only what the day brings.
        </p>

        <button
          onClick={() => document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth" })}
          className="btn btn-primary text-base tracking-[0.06em] px-10"
        >
          RESERVE YOUR PLACE
        </button>
      </div>

      {/* Scroll Prompt */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-white/60 text-xs tracking-[3px]">
        SCROLL TO BEGIN
        <div className="w-px h-10 bg-white/30 mt-2" />
      </div>
    </section>
  );
}
