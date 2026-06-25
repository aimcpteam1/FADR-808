"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";

// Exposes the live Lenis instance so components (e.g. SectionNav) can drive
// programmatic smooth-scroll via lenis.scrollTo().
const ScrollCtx = createContext<Lenis | null>(null);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const l = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    setLenis(l);

    // Keep GSAP ScrollTrigger in sync with Lenis-driven scroll.
    l.on("scroll", ScrollTrigger.update);

    let rafId = 0;
    const raf = (time: number) => {
      l.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      l.destroy();
      setLenis(null);
    };
  }, []);

  return <ScrollCtx.Provider value={lenis}>{children}</ScrollCtx.Provider>;
}

/** Access the Lenis instance (null until mounted). */
export function useSmoothScroll() {
  return useContext(ScrollCtx);
}
