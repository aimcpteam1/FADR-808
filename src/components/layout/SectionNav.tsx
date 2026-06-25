"use client";

import { useEffect, useState } from "react";
import { useSmoothScroll } from "@/providers";
import { EXPERIENCE_SECTIONS } from "@/constants";

/**
 * Side dot-navigation that ties the independent feature scenes into one
 * experience. It only reads section ids from the DOM — features stay
 * fully decoupled and unaware of the nav.
 */
export function SectionNav() {
  const lenis = useSmoothScroll();
  const [active, setActive] = useState(EXPERIENCE_SECTIONS[0].id);

  // Highlight whichever section sits across the viewport center.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    EXPERIENCE_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el);
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Experience sections"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-5"
    >
      {EXPERIENCE_SECTIONS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => goTo(id)}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center gap-3 justify-end"
          >
            <span
              className={[
                "font-mono text-[10px] tracking-[0.3em] uppercase transition-opacity duration-200",
                isActive
                  ? "text-brand-neon opacity-100"
                  : "text-brand-muted opacity-0 group-hover:opacity-100",
              ].join(" ")}
            >
              {label}
            </span>
            <span
              className={[
                "h-2.5 w-2.5 rounded-full border transition-all duration-200",
                isActive
                  ? "bg-brand-neon border-brand-neon shadow-[0_0_10px_var(--clr-neon)] scale-110"
                  : "bg-transparent border-brand-muted group-hover:border-brand-neon",
              ].join(" ")}
            />
          </button>
        );
      })}
    </nav>
  );
}
