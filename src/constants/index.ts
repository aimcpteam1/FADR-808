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
