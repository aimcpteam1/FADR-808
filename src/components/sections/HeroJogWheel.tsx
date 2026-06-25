"use client";

import { useJogWheel } from "@/hooks";
import type { SectionProps } from "@/types";

/**
 * Hero Jog Wheel
 *
 * A draggable DJ jog wheel with rotational inertia. All rotation logic lives
 * in `useJogWheel`; this component is purely the visual shell.
 *
 * Sound hook-up (later): pass an `onRotate` callback into `useJogWheel` below
 * and read `velocity` / `angle` to scrub or pitch-bend a track. No structural
 * change to this component will be needed.
 */
export function HeroJogWheel({ id = "hero", className }: SectionProps) {
  const { wheelRef, isDragging, handlers } = useJogWheel<HTMLDivElement>({
    friction: 0.045,
    // onRotate: ({ velocity, angle }) => {
    //   // sound module attaches here
    // },
  });

  return (
    <section
      id={id}
      className={[
        "relative min-h-screen flex flex-col items-center justify-center gap-12 select-none",
        className ?? "",
      ].join(" ")}
    >
      <div
        className="relative"
        style={{ width: "min(72vw, 460px)", height: "min(72vw, 460px)" }}
      >
        {/* Rotating disc — everything inside spins together */}
        <div
          ref={wheelRef}
          {...handlers}
          className={[
            "absolute inset-0 rounded-full touch-none will-change-transform",
            "border border-white/10 shadow-2xl",
            "bg-[radial-gradient(circle_at_center,#2c2c2c_0%,#1a1a1a_58%,#0e0e0e_100%)]",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          ].join(" ")}
          style={{ transform: "rotate(0deg)" }}
        >
          {/* Outer textured grip ring */}
          <div
            className="absolute inset-2 rounded-full opacity-40"
            style={{
              background:
                "repeating-conic-gradient(#000 0deg 3deg, transparent 3deg 6deg)",
              maskImage:
                "radial-gradient(circle, transparent 78%, #000 79%, #000 100%)",
              WebkitMaskImage:
                "radial-gradient(circle, transparent 78%, #000 79%, #000 100%)",
            }}
          />

          {/* Grip notch — the obvious rotation cue */}
          <div className="absolute left-1/2 top-3 -translate-x-1/2 flex flex-col items-center gap-1">
            <span className="block h-10 w-1 rounded-full bg-brand-neon shadow-[0_0_12px_var(--clr-neon)]" />
            <span className="block h-2 w-2 rounded-full bg-brand-neon" />
          </div>

          {/* Product label — stand-in for the product image.
              Swap this block for <Image src="/images/product.png" .../> later;
              it already rotates with the wheel. */}
          <div className="absolute inset-[28%] rounded-full bg-brand-surface border border-white/10 flex items-center justify-center overflow-hidden">
            <div className="text-center">
              <p className="font-display text-2xl tracking-widest text-brand-neon leading-none">
                FADR
              </p>
              <p className="font-mono text-[10px] tracking-[0.3em] text-brand-muted mt-1">
                808
              </p>
            </div>
          </div>

          {/* Spindle hole */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-black border border-white/20" />
        </div>
      </div>

      {/* Hint */}
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-brand-muted">
        Drag to spin
      </p>
    </section>
  );
}
