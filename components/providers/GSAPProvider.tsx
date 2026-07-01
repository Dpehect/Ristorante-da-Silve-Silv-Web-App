"use client";

import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * GSAPProvider
 * Registers GSAP plugins globally and sets up ScrollTrigger defaults
 * for premium scroll-driven animations (cravburgers.shop inspired).
 */

// Register immediately at module load for client-side to ensure plugin is available before any animations
gsap.registerPlugin(ScrollTrigger);

export function GSAPProvider({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    // Elegant ScrollTrigger defaults for this project
    ScrollTrigger.defaults({
      toggleActions: "play none none reverse",
      markers: false,
    });

    // Refresh on resize for reliability
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
      // Note: avoid killAll in production to prevent killing triggers from other components
    };
  }, []);

  return <>{children}</>;
}
