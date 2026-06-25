import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Three Fiber / Three.js transpilation
  transpilePackages: ["three"],

  // Empty turbopack config silences the webpack-vs-turbopack warning.
  // Shader (glsl) raw-loading will be added here when needed.
  turbopack: {},
};

export default nextConfig;
