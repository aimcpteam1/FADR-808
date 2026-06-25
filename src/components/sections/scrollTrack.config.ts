// ─── One Track, One Scroll — DJ set phases ───
//
// The whole page section behaves like a single track. Scrolling moves the
// "playhead" through four phases whose `energy` (0–1) shapes the visual
// intensity, so the set naturally ramps into the Drop and eases out.

export interface TrackPhase {
  id: string;
  label: string;
  time: string;   // playhead timestamp
  copy: string;
  energy: number; // 0–1 intensity
}

export const TRACK_PHASES: TrackPhase[] = [
  {
    id: "intro",
    label: "INTRO",
    time: "00:00",
    copy: "Lights down. The room holds its breath.",
    energy: 0.15,
  },
  {
    id: "buildup",
    label: "BUILD UP",
    time: "01:12",
    copy: "Filters open. Tension climbs, bar by bar.",
    energy: 0.6,
  },
  {
    id: "drop",
    label: "DROP",
    time: "02:30",
    copy: "Everything hits at once.",
    energy: 1,
  },
  {
    id: "outro",
    label: "OUTRO",
    time: "03:48",
    copy: "The bass fades. The night carries on.",
    energy: 0.25,
  },
];
