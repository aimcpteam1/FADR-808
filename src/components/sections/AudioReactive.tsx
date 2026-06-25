"use client";

import { useEffect, useRef, useState } from "react";
import { useAudioContext } from "@/providers";
import { DEFAULT_TRACK } from "@/constants";
import type { SectionProps } from "@/types";

const BAR_COUNT = 56;

/**
 * Audio-Reactive system (visualization layer).
 *
 * Reads live data from the shared AudioEngine each frame and draws a simple
 * spectrum bar graph plus BPM / bass / mid / treble readouts.
 *
 * Auto-connect: this renders an <audio> bound to the engine. Drop a file at
 * public/audio/track.mp3 (DEFAULT_TRACK) and it plays on the Play button —
 * no code change required.
 */
export function AudioReactive({ id = "audio", className }: SectionProps) {
  const { engineRef, isPlaying, toggle, setVolume } = useAudioContext();

  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef(0);
  const [readout, setReadout] = useState({ bpm: 0, bass: 0, mid: 0, treble: 0 });

  // Per-frame render loop — bars update via DOM refs (no React re-render),
  // numeric readouts are throttled to ~10fps.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    let frame = 0;
    const loop = (now: number) => {
      const a = engine.analyse(now);
      const { frequency } = a;
      const step = Math.max(1, Math.floor(frequency.length / BAR_COUNT));

      for (let i = 0; i < BAR_COUNT; i++) {
        const el = barsRef.current[i];
        if (!el) continue;
        const v = frequency[i * step] / 255;
        el.style.transform = `scaleY(${Math.max(0.02, v)})`;
      }

      if (frame % 6 === 0) {
        setReadout({
          bpm: a.bpm,
          bass: a.bands.bass,
          mid: a.bands.mid,
          treble: a.bands.treble,
        });
      }
      frame++;
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [engineRef]);

  return (
    <section
      id={id}
      className={[
        "relative min-h-screen flex flex-col items-center justify-center gap-10 px-6",
        className ?? "",
      ].join(" ")}
    >
      {/* Bound audio element — attaching the ref wires it to the engine. */}
      <audio
        ref={(el) => {
          if (el) engineRef.current?.attach(el);
        }}
        src={DEFAULT_TRACK}
        loop
        preload="auto"
      />

      <h2 className="font-display text-5xl md:text-7xl tracking-widest text-brand-neon">
        AUDIO REACTIVE
      </h2>

      {/* Spectrum bar graph */}
      <div className="flex items-end gap-[3px] h-48 w-full max-w-3xl">
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              barsRef.current[i] = el;
            }}
            className="flex-1 h-full origin-bottom bg-brand-neon rounded-sm"
            style={{ transform: "scaleY(0.02)" }}
          />
        ))}
      </div>

      {/* Readouts */}
      <div className="grid grid-cols-4 gap-6 font-mono text-center">
        <Readout label="BPM"    value={readout.bpm ? String(readout.bpm) : "--"} />
        <Readout label="BASS"   value={pct(readout.bass)} />
        <Readout label="MID"    value={pct(readout.mid)} />
        <Readout label="TREBLE" value={pct(readout.treble)} />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={toggle}
          className="font-mono text-xs tracking-widest uppercase border border-brand-neon
                     text-brand-neon px-6 py-3 hover:bg-brand-neon hover:text-brand-bg
                     transition-colors duration-200"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-brand-muted">
          Vol
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            defaultValue={1}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="accent-brand-neon"
          />
        </label>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-muted">
        Drop an mp3 at <span className="text-brand-text">public/audio/track.mp3</span>
      </p>
    </section>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl md:text-3xl text-brand-text tabular-nums">{value}</div>
      <div className="text-[10px] tracking-[0.3em] text-brand-muted mt-1">{label}</div>
    </div>
  );
}

const pct = (v: number) => `${Math.round(v * 100)}`;
