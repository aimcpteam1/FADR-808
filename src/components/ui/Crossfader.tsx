"use client";

import { useFader } from "@/hooks";

interface CrossfaderProps {
  /** 0 = full A, 0.5 = center, 1 = full B. */
  initial?: number;
  onChange?: (value: number) => void;
}

/** Horizontal crossfader between deck A and deck B. */
export function Crossfader({ initial = 0.5, onChange }: CrossfaderProps) {
  const { trackRef, value, isDragging, handlers } = useFader({
    orientation: "horizontal",
    initial,
    onChange,
  });

  return (
    <div className="flex flex-col items-center gap-2 select-none w-full max-w-xs">
      <div
        ref={trackRef}
        {...handlers}
        className={[
          "relative h-10 w-full rounded-md bg-brand-surface border border-white/10 touch-none",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        ].join(" ")}
      >
        {/* Center detent mark */}
        <div className="absolute left-1/2 -translate-x-1/2 inset-y-2 w-px bg-white/15" />
        {/* Handle */}
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-4 rounded-sm bg-brand-neon shadow-[0_0_10px_var(--clr-neon)]"
          style={{ left: `${value * 100}%` }}
        />
      </div>
      <div className="flex justify-between w-full font-mono text-[10px] tracking-[0.3em] text-brand-muted">
        <span>A</span>
        <span>CROSSFADER</span>
        <span>B</span>
      </div>
    </div>
  );
}
