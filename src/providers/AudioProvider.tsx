"use client";

import { createContext, useContext } from "react";
import { useAudio } from "@/hooks";

type AudioContextValue = ReturnType<typeof useAudio>;

const AudioCtx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audio = useAudio();
  return <AudioCtx.Provider value={audio}>{children}</AudioCtx.Provider>;
}

export function useAudioContext(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudioContext must be used inside <AudioProvider>");
  return ctx;
}
