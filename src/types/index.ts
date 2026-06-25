// ─── Navigation ──────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
}

// ─── Audio ───────────────────────────────────────
export interface AudioState {
  isPlaying: boolean;
  volume: number;       // 0–1
  frequency: number[];  // analyser data
  bpm: number;
}

// ─── Animation ───────────────────────────────────
export type EasingPreset = "outExpo" | "inExpo" | "inOutExpo";

// ─── Section ─────────────────────────────────────
export interface SectionProps {
  id?: string;
  className?: string;
}
