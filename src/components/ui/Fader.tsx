"use client";

import { useFader } from "@/hooks";

interface FaderProps {
  label?: string;
  initial?: number;
  onChange?: (value: number) => void;
}

/** Vertical volume fader. Drag the handle up/down. */
export function Fader({ label, initial = 0.75, onChange }: FaderProps) {
  const { trackRef, value, isDragging, handlers } = useFader({
    orientation: "vertical",
    initial,
    onChange,
  });

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div
        ref={trackRef}
        {...handlers}
        className={[
          "relative h-48 w-10 rounded-md bg-brand-surface border border-white/10 touch-none",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        ].join(" ")}
      >
        {/* Fill */}
        <div
          className="absolute bottom-0 left-0 right-0 rounded-md bg-brand-neon/20"
          style={{ height: `${value * 100}%` }}
        />
        {/* Center groove */}
        <div className="absolute inset-y-2 left-1/2 -translate-x-1/2 w-px bg-white/10" />
        {/* Handle */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-8 rounded-sm bg-brand-neon shadow-[0_0_10px_var(--clr-neon)]"
          style={{ bottom: `calc(${value * 100}% )` }}
        />
      </div>
      {label && (
        <span className="font-mono text-[10px] tracking-[0.3em] text-brand-muted uppercase">
          {label}
        </span>
      )}
      <span className="font-mono text-xs text-brand-text tabular-nums">
        {Math.round(value * 100)}
      </span>
    </div>
  );
}
