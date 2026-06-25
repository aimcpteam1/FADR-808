"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, BRAND_NAME } from "@/constants";

export function Navigation() {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[var(--z-nav,100)] h-[var(--nav-height)]
                 flex items-center justify-between px-6 md:px-12
                 bg-brand-bg/80 backdrop-blur-md border-b border-white/5"
    >
      {/* Logo */}
      <Link href="/" className="font-display text-2xl tracking-widest text-brand-neon">
        {BRAND_NAME}
      </Link>

      {/* Nav links */}
      <nav aria-label="Main navigation">
        <ul className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={[
                  "font-mono text-sm tracking-wider uppercase transition-colors duration-200",
                  pathname === href
                    ? "text-brand-neon"
                    : "text-brand-muted hover:text-brand-text",
                ].join(" ")}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* CTA */}
      <Link
        href="/product"
        className="hidden md:inline-flex items-center gap-2
                   font-mono text-xs tracking-widest uppercase
                   border border-brand-neon text-brand-neon
                   px-4 py-2 hover:bg-brand-neon hover:text-brand-bg
                   transition-colors duration-200"
      >
        Shop Now
      </Link>

      {/* Mobile menu placeholder — wired up in a future feature */}
      <button
        className="md:hidden text-brand-text"
        aria-label="Open menu"
      >
        <span className="block w-6 h-px bg-current mb-1.5" />
        <span className="block w-6 h-px bg-current mb-1.5" />
        <span className="block w-4 h-px bg-current" />
      </button>
    </header>
  );
}
