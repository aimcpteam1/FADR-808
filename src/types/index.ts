// ─── Navigation ──────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
}

// ─── Audio ───────────────────────────────────────
// Live analysis shapes live with the engine — re-exported for convenience.
export type { AudioAnalysis, FrequencyBands } from "@/lib/audio";

// ─── Animation ───────────────────────────────────
export type EasingPreset = "outExpo" | "inExpo" | "inOutExpo";

// ─── Section ─────────────────────────────────────
export interface SectionProps {
  id?: string;
  className?: string;
}
