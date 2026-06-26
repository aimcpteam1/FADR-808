"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useAudioContext } from "@/providers";
import { DEFAULT_TRACK, asset } from "@/constants";
import type { SectionProps } from "@/types";

/**
 * Hero — the landing screen.
 *
 * Full-screen muted background video, outlined FADR-808 logo, CONTROL / PLAY
 * controls, and the "CONTROL THE VIBE" copy block. PLAY toggles the track via
 * the shared AudioEngine; CONTROL jumps into the product page.
 */
export function Hero({ id = "hero", className }: SectionProps) {
  const { isPlaying, toggle } = useAudioContext();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Guarantee muted autoplay (React doesn't reliably set the muted property,
  // which some browsers require before allowing autoplay).
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
        "flex items-center justify-center text-center select-none",
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

      {/* Audio track (visual video stays muted; this is the music) */}
      <audio src={DEFAULT_TRACK} loop preload="auto" className="hidden" />

      {/* Foreground */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 w-full max-w-4xl">
        {/* Logo + flanking controls */}
        <div className="relative w-full flex items-center justify-center">
          <h1 className="hero-logo font-mono font-bold leading-[0.9] tracking-tight text-[clamp(4rem,16vw,11rem)]">
            <span className="block">FADR</span>
            <span className="block">-808</span>
          </h1>

          {/* CONTROL (left) */}
          <CircleButton
            label="CONTROL"
            className="absolute left-0 top-1/2 -translate-y-1/2"
            onClick={undefined}
            href="/product"
          />
          {/* PLAY (right) */}
          <CircleButton
            label={isPlaying ? "PAUSE" : "PLAY-"}
            className="absolute right-0 top-1/2 -translate-y-1/2"
            onClick={toggle}
          />
        </div>

        {/* Banner */}
        <div className="w-full max-w-2xl bg-white/15 backdrop-blur-sm py-2">
          <p className="font-mono font-bold tracking-[0.25em] text-brand-lime text-xl md:text-2xl">
            CONTROL THE VIBE
          </p>
        </div>

        {/* Copy */}
        <div className="w-full max-w-2xl">
          <p className="font-mono text-brand-text/90 text-sm md:text-base [text-align:justify] [text-align-last:justify] leading-relaxed">
            Every movement shapes the atmosphere. Every touch creates energy.
            Every party begins with someone taking control.
          </p>
          <div className="mt-4 h-px w-full bg-brand-lime shadow-[0_0_10px_var(--clr-lime)]" />
        </div>
      </div>
    </section>
  );
}

/** Cyan ring control with a lime label. Renders as button or link. */
function CircleButton({
  label,
  className,
  onClick,
  href,
}: {
  label: string;
  className?: string;
  onClick?: () => void;
  href?: string;
}) {
  const inner = (
    <span className="flex flex-col items-center gap-2">
      <span className="grid h-12 w-12 place-items-center rounded-full border-[3px] border-brand-cyan shadow-[0_0_12px_var(--clr-cyan)]">
        <span className="h-4 w-4 rounded-full border-2 border-brand-cyan" />
      </span>
      <span className="font-mono font-bold text-sm tracking-widest text-brand-lime">
        {label}
      </span>
    </span>
  );

  const cls = ["hidden md:block", className ?? ""].join(" ");

  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
