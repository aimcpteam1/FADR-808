import type { NavItem } from "@/types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Product",    href: "/product"    },
  { label: "Experience", href: "/experience" },
  { label: "About",      href: "/about"      },
];

export const BRAND_NAME = "FADR-808";
export const BRAND_TAGLINE = "Feel the Drop";

// Default audio track. Drop an mp3 at public/audio/track.mp3 to auto-connect.
export const DEFAULT_TRACK = "/audio/track.mp3";

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
