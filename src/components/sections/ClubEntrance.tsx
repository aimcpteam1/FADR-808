"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@/hooks";
import type { SectionProps } from "@/types";
import {
  STAGES,
  TRAVEL_DISTANCE,
  PERSPECTIVE,
  SCROLL_VH,
  FRAME_COUNT,
  FRAME_STEP,
} from "./clubEntrance.config";

/**
 * Club Entrance Journey
 *
 * Scroll-driven camera move through ENTRANCE → HALLWAY → DJ BOOTH.
 *
 * Structure:
 *  - A tall trigger section (SCROLL_VH) provides the scroll distance.
 *  - A sticky viewport holds the CSS-3D world (perspective camera).
 *  - GSAP ScrollTrigger (scrubbed, synced with Lenis) translates the world
 *    forward on Z, flying the camera through the stages and corridor frames.
 *
 * Design is intentionally minimal — this commit is about the scroll/camera
 * structure, not visuals. Swap the frame/stage markers for real geometry later.
 */
export function ClubEntrance({ id = "entrance", className }: SectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !worldRef.current) return;

      gsap.to(worldRef.current, {
        z: TRAVEL_DISTANCE, // move camera forward through the world
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
    },
    [],
    { scope: sectionRef }
  );

  // Corridor frames placed at successive depths.
  const frames = Array.from({ length: FRAME_COUNT }, (_, i) => -i * FRAME_STEP);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={["relative", className ?? ""].join(" ")}
      style={{ height: `${SCROLL_VH}vh` }}
    >
      {/* Sticky viewport — the "camera lens" */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden bg-brand-bg"
        style={{ perspective: `${PERSPECTIVE}px` }}
      >
        {/* The 3D world that gets pushed toward the viewer */}
        <div
          ref={worldRef}
          className="absolute left-1/2 top-1/2"
          style={{ transformStyle: "preserve-3d", transform: "translateZ(0px)" }}
        >
          {/* Corridor frames */}
          {frames.map((z, i) => (
            <div
              key={`frame-${i}`}
              className="absolute left-1/2 top-1/2 border border-white/10"
              style={{
                width: 760,
                height: 480,
                transform: `translate(-50%, -50%) translateZ(${z}px)`,
                opacity: 1 - i / FRAME_COUNT,
              }}
            />
          ))}

          {/* Stage markers */}
          {STAGES.map((stage) => (
            <div
              key={stage.id}
              className="absolute left-1/2 top-1/2 flex flex-col items-center text-center"
              style={{
                transform: `translate(-50%, -50%) translateZ(${stage.z}px)`,
              }}
            >
              <h2 className="font-display text-5xl md:text-7xl tracking-widest text-brand-neon whitespace-nowrap">
                {stage.label}
              </h2>
              <p className="font-mono text-xs md:text-sm uppercase tracking-[0.35em] text-brand-muted mt-3">
                {stage.caption}
              </p>
            </div>
          ))}
        </div>

        {/* Depth vignette — fades far geometry into black (fog) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, transparent 40%, var(--clr-bg) 85%)",
          }}
        />

        {/* Scroll hint */}
        <p className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-brand-muted">
          Scroll to enter
        </p>
      </div>
    </section>
  );
}
