"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/constants";

const GENRE_TRACK: Record<string, string> = {
  House:  "/music/house.mp3",
  EDM:    "/music/edm.mp3",
  Techno: "/music/techno.mp3",
  Trance: "/music/trance.mp3",
  DnB:    "/music/dnb.mp3",
  Garage: "/music/garage.mp3",
};

const FADE_MS = 500;

/**
 * Plays the track for the given genre. Whenever the genre changes, the current
 * track fades out (~0.5s), the new one starts from 0 and fades in (~0.5s).
 *
 * Autoplay policy: nothing plays until the first user interaction (any click /
 * key / touch), after which genre changes auto-play. Adds no UI.
 */
export function useGenreMusic(genre: string | undefined) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockedRef = useRef(false);
  const genreRef = useRef<string | undefined>(undefined);
  const fadeRaf = useRef(0);

  // One reusable audio element.
  useEffect(() => {
    const a = new Audio();
    a.loop = true;
    a.preload = "auto";
    a.volume = 0;
    audioRef.current = a;
    return () => {
      cancelAnimationFrame(fadeRaf.current);
      a.pause();
      a.src = "";
    };
  }, []);

  // Ramp volume to a target over `ms`, then run `onDone`.
  const fadeTo = (target: number, ms: number, onDone?: () => void) => {
    const a = audioRef.current;
    if (!a) return;
    cancelAnimationFrame(fadeRaf.current);
    const from = a.volume;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      a.volume = Math.max(0, Math.min(1, from + (target - from) * k));
      if (k < 1) fadeRaf.current = requestAnimationFrame(tick);
      else onDone?.();
    };
    fadeRaf.current = requestAnimationFrame(tick);
  };

  // Switch to a genre's track: fade out → swap → restart → fade in.
  const switchTo = (g: string) => {
    const a = audioRef.current;
    const src = GENRE_TRACK[g];
    if (!a || !src) return;
    const start = () => {
      a.src = asset(src);
      a.currentTime = 0;
      a.volume = 0;
      a.play().then(() => fadeTo(1, FADE_MS)).catch(() => {});
    };
    if (!a.paused && a.src) fadeTo(0, FADE_MS, start);
    else start();
  };

  // React to genre changes (only once audio is unlocked).
  useEffect(() => {
    genreRef.current = genre;
    if (genre && unlockedRef.current) switchTo(genre);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genre]);

  // Double-click anywhere stops the music (fade out, then pause).
  useEffect(() => {
    const stop = () => {
      const a = audioRef.current;
      if (!a || a.paused) return;
      fadeTo(0, FADE_MS, () => a.pause());
    };
    document.addEventListener("dblclick", stop);
    return () => document.removeEventListener("dblclick", stop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Unlock playback on the first user gesture.
  useEffect(() => {
    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      if (genreRef.current) switchTo(genreRef.current);
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
      document.removeEventListener("touchstart", unlock);
    };
    document.addEventListener("pointerdown", unlock);
    document.addEventListener("keydown", unlock);
    document.addEventListener("touchstart", unlock);
    return () => {
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
      document.removeEventListener("touchstart", unlock);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
