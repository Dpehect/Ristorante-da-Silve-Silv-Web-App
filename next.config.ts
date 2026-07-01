import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack to avoid compatibility issues with GSAP, Lenis, and some client libraries in Next.js 16
  // This forces the stable webpack bundler which is more reliable for complex animation setups
  experimental: {
    turbo: false,
  },
};

export default nextConfig;
