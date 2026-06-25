import Link from "next/link";
import { BRAND_NAME, BRAND_TAGLINE, NAV_ITEMS } from "@/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-brand-surface px-6 md:px-12 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <p className="font-display text-3xl text-brand-neon tracking-widest mb-2">
            {BRAND_NAME}
          </p>
          <p className="font-mono text-xs text-brand-muted uppercase tracking-widest">
            {BRAND_TAGLINE}
          </p>
        </div>

        {/* Nav */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-col gap-2">
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-mono text-sm text-brand-muted hover:text-brand-text
                             uppercase tracking-wider transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Legal */}
        <div className="flex flex-col justify-end">
          <p className="font-mono text-xs text-brand-muted">
            © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
