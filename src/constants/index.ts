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

// Default audio track shipped with the repo (plays on the live site).
export const DEFAULT_TRACK = asset("/audio/track.mp3");
