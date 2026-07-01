"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function Story() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      // Cinematic slow reveal of the story section
      gsap.fromTo(
        containerRef.current,
        { backgroundColor: "#1a1916" }, // Start darker
        {
          backgroundColor: "#2c2a26", // Fade to base secondary color
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "center center",
            scrub: true,
          }
        }
      );

      // Paragraph by paragraph reveal
      const paragraphs = textRef.current?.querySelectorAll("p");
      paragraphs?.forEach((p) => {
        gsap.from(p, {
          y: 50,
          opacity: 0,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: p,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative py-48 px-8 md:px-24 min-h-screen flex items-center justify-center">
      <div className="max-w-3xl mx-auto" ref={textRef}>
        <h2 className="text-sm tracking-[0.3em] uppercase text-accent mb-12 text-center">La Nostra Storia</h2>
        
        <div className="space-y-12 text-lg md:text-2xl leading-relaxed text-primary/90 font-light text-center">
          <p>
            Da Silve is not a restaurant. It is our home, opened to those who seek not just a meal, but an experience of genuine Apulian hospitality.
          </p>
          <p>
            There is no written menu. Maria cooks what the sea and the land offer each morning. Silve pours the wine. The rhythm of the evening is dictated by the season.
          </p>
          <p className="italic text-accent">
            "We serve what we would serve our family."
          </p>
        </div>
      </div>
    </section>
  );
}
