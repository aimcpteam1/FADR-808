"use client";

import { useCallback, useState } from "react";

interface PadProps {
  label: string;
  /** Fired on press — attach a sample/cue here later. */
  onTrigger?: (label: string) => void;
}

/** Performance pad. Press to trigger; flashes on hit. */
export function Pad({ label, onTrigger }: PadProps) {
  const [active, setActive] = useState(false);

  const trigger = useCallback(() => {
    setActive(true);
    onTrigger?.(label);
    window.setTimeout(() => setActive(false), 120);
  }, [label, onTrigger]);

  return (
    <button
      onPointerDown={trigger}
      className={[
        "aspect-square rounded-md border font-mono text-xs tracking-widest uppercase",
        "transition-colors duration-75 select-none touch-none",
        active
          ? "bg-brand-neon text-brand-bg border-brand-neon shadow-[0_0_16px_var(--clr-neon)]"
          : "bg-brand-surface text-brand-muted border-white/10 hover:border-brand-neon/50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
