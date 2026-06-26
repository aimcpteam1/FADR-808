"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, BRAND_NAME } from "@/constants";

export function Navigation() {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[var(--z-nav,100)] h-[var(--nav-height)]
                 flex items-center justify-between px-6 md:px-12 bg-brand-lime text-black"
    >
      {/* Logo */}
      <Link href="/" className="font-mono font-bold text-2xl tracking-widest text-black">
        {BRAND_NAME}
      </Link>

      {/* Nav links */}
      <nav aria-label="Main navigation">
        <ul className="flex items-center gap-6 md:gap-10">
          {NAV_ITEMS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={[
                  "font-mono text-sm md:text-base tracking-wider uppercase transition-opacity duration-200",
                  pathname === href ? "opacity-100 underline" : "opacity-70 hover:opacity-100",
                ].join(" ")}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
