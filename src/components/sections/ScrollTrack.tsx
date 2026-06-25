"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@/hooks";
import type { SectionProps } from "@/types";
import { TRACK_PHASES } from "./scrollTrack.config";

/**
 * One Track, One Scroll
 *
 * The page reads as a single DJ set: INTRO → BUILD UP → DROP → OUTRO.
 *
 * Scroll animation structure:
 *  - Each phase is a full-height panel; its heading reveals on enter
 *    (toggleActions, reversible) so phases connect as you scroll either way.
 *  - The DROP gets an extra elastic "punch" + neon flash for impact.
 *  - A sticky playhead timeline at the bottom is scrubbed across the whole
 *    track, and an onUpdate trigger highlights the active phase.
 *
 * All animation lives in one gsap.context (via useGSAP) for clean teardown.
 */
export function ScrollTrack({ id = "track", className }: SectionProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      // 1) Per-phase heading reveal (reversible both directions).
      gsap.utils.toArray<HTMLElement>(".track-panel").forEach((panel) => {
        gsap.from(panel.querySelector(".track-heading"), {
          yPercent: 40,
          opacity: 0,
          filter: "blur(12px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: panel,
            start: "top 70%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // 2) DROP impact — elastic scale punch + flash.
      const drop = scope.querySelector<HTMLElement>(".is-drop");
      if (drop) {
        gsap.fromTo(
          drop.querySelector(".track-heading"),
          { scale: 0.9 },
          {
            scale: 1,
            ease: "elastic.out(1, 0.45)",
            duration: 1.1,
            scrollTrigger: {
              trigger: drop,
              start: "top 60%",
              toggleActions: "play none none reverse",
            },
          }
        );
        gsap.fromTo(
          drop.querySelector(".drop-flash"),
          { opacity: 0.6 },
          {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: drop,
              start: "top 60%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // 3) Playhead fill — scrubbed across the entire track.
      gsap.fromTo(
        fillRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: scope,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );

      // 4) Active-phase index for timeline highlighting.
      ScrollTrigger.create({
        trigger: scope,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const idx = Math.min(
            TRACK_PHASES.length - 1,
            Math.floor(self.progress * TRACK_PHASES.length)
          );
          setActive(idx);
        },
      });
    },
    [],
    { scope: scopeRef }
  );

  return (
    <section id={id} ref={scopeRef} className={["relative", className ?? ""].join(" ")}>
      {/* Phase panels */}
      {TRACK_PHASES.map((phase) => (
        <div
          key={phase.id}
          className={[
            "track-panel relative min-h-screen flex flex-col items-center justify-center overflow-hidden",
            phase.id === "drop" ? "is-drop" : "",
          ].join(" ")}
        >
          {/* Energy glow — intensity scales with the phase */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, var(--clr-neon) 0%, transparent 60%)",
              opacity: phase.energy * 0.14,
            }}
          />
          {/* Drop flash overlay */}
          {phase.id === "drop" && (
            <div
              className="drop-flash pointer-events-none absolute inset-0"
              style={{ background: "var(--clr-neon)", opacity: 0 }}
            />
          )}

          <div className="track-heading relative z-10 flex flex-col items-center text-center px-6">
            <span className="font-mono text-xs tracking-[0.4em] text-brand-muted mb-4">
              {phase.time}
            </span>
            <h2 className="font-display text-6xl md:text-[10vw] leading-none tracking-widest text-brand-neon">
              {phase.label}
            </h2>
            <p className="font-body text-sm md:text-base text-brand-muted mt-6 max-w-md">
              {phase.copy}
            </p>
          </div>
        </div>
      ))}

      {/* Sticky playhead timeline */}
      <div className="sticky bottom-0 left-0 right-0 z-20 px-6 md:px-12 pb-6 pointer-events-none">
        {/* Progress rail */}
        <div className="relative h-px w-full bg-white/10">
          <div
            ref={fillRef}
            className="absolute inset-y-0 left-0 w-full bg-brand-neon origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        {/* Phase ticks */}
        <div className="mt-3 flex justify-between">
          {TRACK_PHASES.map((phase, i) => (
            <span
              key={phase.id}
              className={[
                "font-mono text-[10px] tracking-[0.3em] transition-colors duration-300",
                i === active ? "text-brand-neon" : "text-brand-muted",
              ].join(" ")}
            >
              {phase.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
