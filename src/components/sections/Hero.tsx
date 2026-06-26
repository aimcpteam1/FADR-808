"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/constants";
import type { SectionProps } from "@/types";

/**
 * Hero — the landing screen.
 *
 * Full-screen muted background video with the FADR-808 / CONTROL THE VIBE
 * composition overlaid as a single transparent PNG (centered).
 */
export function Hero({ id = "hero", className }: SectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Guarantee muted autoplay across browsers.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <section
      id={id}
      className={[
        "relative w-full min-h-[calc(100svh-var(--nav-height))] overflow-hidden",
        "flex items-center justify-center select-none",
        className ?? "",
      ].join(" ")}
    >
      {/* Background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={asset("/video/hero.mp4")} type="video/mp4" />
      </video>

      {/* Legibility overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Centered composition */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/images/hero-center.png")}
        alt="FADR-808 — Control the vibe"
        className="relative z-10 w-[92vw] max-w-5xl h-auto"
      />
    </section>
  );
}
