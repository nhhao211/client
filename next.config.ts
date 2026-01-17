import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Compiler for auto-memoization
  reactCompiler: true,

  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Reduce bundle by excluding source maps in production
  productionBrowserSourceMaps: false,

  // Enable experimental optimizations
  experimental: {
    // Optimize package imports - only import what's used
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-tooltip",
      "framer-motion",
    ],
  },

  // Turbopack configuration (Next.js 16+ default bundler)
  turbopack: {
    // Resolve aliases for optimized imports
    resolveAlias: {
      // Use optimized highlight.js with only needed languages
      "highlight.js": "highlight.js/lib/core",
    },
  },
};

export default nextConfig;
