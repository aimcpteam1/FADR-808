"use client";

import { useLenis } from "@/hooks";

// Activates Lenis smooth scroll for the entire app.
// Wrap inside RootLayout so it runs once at the top level.
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useLenis();
  return <>{children}</>;
}
