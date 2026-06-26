import type { NextConfig } from "next";

// GitHub Pages serves the repo under a sub-path: /<repo>.
// basePath/assetPrefix are only applied for production builds so local dev
// (npm run dev) keeps working at the root.
const repo = "FADR-808";
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? `/${repo}` : "";

const nextConfig: NextConfig = {
  // Static HTML export → out/ (what GitHub Pages serves)
  output: "export",

  // Sub-path hosting
  basePath,
  assetPrefix: basePath,

  // Pages serves directories; trailing slash avoids 404s on refresh/deep links
  trailingSlash: true,

  images: {
    // No Next.js image optimization server on Pages
    unoptimized: true,
  },

  // Expose basePath to client code so raw asset paths (e.g. audio src) can
  // be prefixed manually — Next does NOT auto-prefix plain string URLs.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
