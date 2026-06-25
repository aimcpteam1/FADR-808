"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AudioEngine } from "@/lib/audio";

/**
 * Owns a single AudioEngine instance and exposes playback controls.
 *
 * The engine is the system's audio core — share it via AudioProvider so every
 * reactive section reads from the same analyser. Visual components run their
 * own rAF loop calling `engineRef.current.analyse()` for per-frame data.
 */
export function useAudio() {
  const engineRef = useRef<AudioEngine | null>(null);
  if (!engineRef.current) engineRef.current = new AudioEngine();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const engine = engineRef.current;
    return () => engine?.dispose();
  }, []);

  const play = useCallback(async () => {
    try {
      await engineRef.current?.play();
      setIsPlaying(true);
      setIsReady(true);
    } catch (err) {
      // Most often: no audio file at the configured src yet.
      console.warn("[AudioEngine] play failed —", err);
    }
  }, []);

  const pause = useCallback(() => {
    engineRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const setVolume = useCallback((v: number) => {
    engineRef.current?.setVolume(v);
  }, []);

  return { engineRef, isPlaying, isReady, play, pause, toggle, setVolume };
}
