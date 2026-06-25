// ─── Club Entrance Journey — spatial layout (in px, along the Z axis) ───
//
// The "camera" is simulated by translating the whole 3D world toward the
// viewer on Z. Stages and corridor frames sit at increasingly negative Z;
// as the world moves +Z by TRAVEL_DISTANCE, the camera flies through them:
//
//   CLUB ENTRANCE (z 0)  →  HALLWAY (z -1500)  →  DJ BOOTH (z -3000)

export interface Stage {
  id: string;
  label: string;
  caption: string;
  z: number;
}

export const STAGES: Stage[] = [
  { id: "entrance", label: "CLUB ENTRANCE", caption: "Step inside",      z: 0     },
  { id: "hallway",  label: "HALLWAY",       caption: "Follow the bass",  z: -1500 },
  { id: "booth",    label: "DJ BOOTH",      caption: "You're on",        z: -3000 },
];

/** How far the camera travels forward across the full scroll (px on Z). */
export const TRAVEL_DISTANCE = 3000;

/** CSS perspective for the viewport (smaller = stronger depth). */
export const PERSPECTIVE = 900;

/** Total scroll length of the pinned journey, in viewport heights. */
export const SCROLL_VH = 400;

// Corridor frames — evenly spaced rectangular outlines we pass through,
// giving the forward-motion / tunnel feeling.
export const FRAME_COUNT = 12;
export const FRAME_STEP = 300; // px between frames on Z
