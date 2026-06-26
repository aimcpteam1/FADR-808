import type { NavItem } from "@/types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Product",    href: "/product"    },
  { label: "Experience", href: "/experience" },
  { label: "About",      href: "/about"      },
];

export const BRAND_NAME = "FADR-808";
export const BRAND_TAGLINE = "Feel the Drop";

// Public asset base path. Empty in dev; "/FADR-808" in the GitHub Pages build
// (injected via next.config.ts env). Prepend to raw string asset URLs since
// Next.js only auto-prefixes framework-managed assets (next/image, _next/*).
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a public-folder path with the deploy base path. */
export const asset = (path: string) => `${BASE_PATH}${path}`;

// Default audio track. A small royalty-free demo beat ships with the repo so
// the visualizer plays on the live site. For local testing you can point this
// at your own file dropped in public/audio/ (e.g. asset("/audio/track.mp3")).
export const DEFAULT_TRACK = asset("/audio/demo.wav");

// ─── Home experience composition ─────────────────
// Single source of truth for the one-page scene order. Each feature stays an
// independent component; this only defines how they are sequenced + navigated.
export interface ExperienceSection {
  id: string;     // DOM id passed to the feature's <section>
  label: string;  // shown in the side navigation
}

export const EXPERIENCE_SECTIONS: ExperienceSection[] = [
  { id: "entrance",   label: "ENTER"      },
  { id: "deck",       label: "DECK"       },
  { id: "set",        label: "THE SET"    },
  { id: "console",    label: "CONSOLE"    },
  { id: "visualizer", label: "VISUALIZER" },
];
