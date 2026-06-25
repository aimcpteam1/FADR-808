"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AudioState } from "@/types";

const FFT_SIZE = 256;

export function useAudio(src?: string) {
  const audioCtxRef  = useRef<AudioContext | null>(null);
  const analyserRef  = useRef<AnalyserNode | null>(null);
  const sourceRef    = useRef<AudioBufferSourceNode | MediaElementAudioSourceNode | null>(null);
  const audioElRef   = useRef<HTMLAudioElement | null>(null);
  const rafRef       = useRef<number>(0);

  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    volume: 1,
    frequency: new Array(FFT_SIZE / 2).fill(0),
    bpm: 0,
  });

  // Initialize AudioContext lazily (must be after user gesture)
  const init = useCallback(() => {
    if (audioCtxRef.current) return;

    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    analyser.connect(ctx.destination);

    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
  }, []);

  const play = useCallback(() => {
    if (!audioCtxRef.current || !analyserRef.current) return;
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    setState((s) => ({ ...s, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    audioCtxRef.current?.suspend();
    setState((s) => ({ ...s, isPlaying: false }));
  }, []);

  const setVolume = useCallback((vol: number) => {
    setState((s) => ({ ...s, volume: vol }));
  }, []);

  // Frequency data polling loop
  useEffect(() => {
    if (!state.isPlaying || !analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const tick = () => {
      analyserRef.current!.getByteFrequencyData(dataArray);
      setState((s) => ({ ...s, frequency: Array.from(dataArray) }));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [state.isPlaying]);

  // Cleanup
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      audioCtxRef.current?.close();
    };
  }, []);

  return {
    state,
    audioElRef,
    analyserRef,
    init,
    play,
    pause,
    setVolume,
  };
}
