"use client";

import { useCallback, useRef, useState } from "react";
import { useJogWheel } from "@/hooks";
import { Fader, Crossfader, Pad } from "@/components/ui";
import { useAudioContext } from "@/providers";
import type { SectionProps } from "@/types";

const PADS = ["CUE", "LOOP", "FX", "SAMPLE"];

/**
 * Mini DJ Console Demo
 *
 * A fully mouse-operable controller surface composed from reusable controls:
 *  - Jog Wheel   → useJogWheel (shared with the Hero section)
 *  - Volume Fader → useFader (vertical), wired to the shared AudioEngine
 *  - Crossfader  → useFader (horizontal)
 *  - Pads        → Pad, onTrigger reserved for sample/cue hook-up
 *
 * Every control feeds the live readout panel so operation is verifiable.
 */
export function MiniDJConsole({ id = "console", className }: SectionProps) {
  const { setVolume } = useAudioContext();

  // Jog wheel — throttle readout updates to avoid spam during inertia.
  const lastAngleRef = useRef(0);
  const [jog, setJog] = useState({ angle: 0, velocity: 0 });
  const { wheelRef, isDragging, handlers } = useJogWheel<HTMLDivElement>({
    onRotate: ({ angle, velocity }) => {
      if (Math.abs(angle - lastAngleRef.current) > 2) {
        lastAngleRef.current = angle;
        setJog({ angle, velocity });
      }
    },
  });

  const [volume, setVol] = useState(75);
  const [xfade, setXfade] = useState(50);
  const [lastPad, setLastPad] = useState("--");

  const onVolume = useCallback(
    (v: number) => {
      setVol(Math.round(v * 100));
      setVolume(v); // real audio: drives shared engine gain
    },
    [setVolume]
  );

  return (
    <section
      id={id}
      className={[
        "relative min-h-screen flex flex-col items-center justify-center gap-10 px-6 py-20",
        className ?? "",
      ].join(" ")}
    >
      <h2 className="font-display text-5xl md:text-7xl tracking-widest text-brand-neon">
        MINI DJ CONSOLE
      </h2>

      {/* Console surface */}
      <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
        {/* Jog Wheel */}
        <div className="flex flex-col items-center gap-3 select-none">
          <div className="relative h-44 w-44">
            <div
              ref={wheelRef}
              {...handlers}
              className={[
                "absolute inset-0 rounded-full touch-none will-change-transform",
                "border border-white/10 bg-[radial-gradient(circle_at_center,#2c2c2c_0%,#1a1a1a_60%,#0e0e0e_100%)]",
                isDragging ? "cursor-grabbing" : "cursor-grab",
              ].join(" ")}
              style={{ transform: "rotate(0deg)" }}
            >
              {/* Grip marker */}
              <span className="absolute left-1/2 top-2 -translate-x-1/2 h-8 w-1 rounded-full bg-brand-neon" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-black border border-white/20" />
            </div>
          </div>
          <span className="font-mono text-[10px] tracking-[0.3em] text-brand-muted uppercase">
            Jog Wheel
          </span>
        </div>

        {/* Volume Fader */}
        <Fader label="Volume" initial={0.75} onChange={onVolume} />

        {/* Pads */}
        <div className="grid grid-cols-2 gap-3 w-44">
          {PADS.map((p) => (
            <Pad key={p} label={p} onTrigger={setLastPad} />
          ))}
        </div>
      </div>

      {/* Crossfader */}
      <Crossfader initial={0.5} onChange={(v) => setXfade(Math.round(v * 100))} />

      {/* Live readout */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-center mt-4">
        <Readout label="JOG °"   value={String(Math.round(jog.angle))} />
        <Readout label="JOG VEL" value={jog.velocity.toFixed(1)} />
        <Readout label="VOLUME"  value={String(volume)} />
        <Readout label="XFADER"  value={`${xfade < 50 ? "A" : xfade > 50 ? "B" : "·"} ${xfade}`} />
      </div>
      <p className="font-mono text-[10px] tracking-[0.3em] text-brand-muted uppercase">
        Last pad: <span className="text-brand-neon">{lastPad}</span>
      </p>
    </section>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl text-brand-text tabular-nums">{value}</div>
      <div className="text-[10px] tracking-[0.3em] text-brand-muted mt-1">{label}</div>
    </div>
  );
}
