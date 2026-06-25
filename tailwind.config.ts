import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          bg:       "#0a0a0a",
          surface:  "#111111",
          neon:     "#00ffcc",
          accent:   "#ff2d78",
          text:     "#f0f0f0",
          muted:    "#666666",
        },
      },
      fontFamily: {
        display: ["var(--font-bebas)", "sans-serif"],
        mono:    ["var(--font-jetbrains)", "monospace"],
        body:    ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "fade-in":   "fadeIn 0.6s var(--ease-out-expo) forwards",
        "slide-up":  "slideUp 0.6s var(--ease-out-expo) forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
