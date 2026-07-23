import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // If you also want to ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist'],
  webpack(config, { isServer }) {
    if (!isServer) {
      config.ignoreWarnings = [
        (warning: { message: string | string[] }) =>
          typeof warning.message === "string" &&
          (warning.message.includes("hydration") ||
            warning.message.includes("React")),
      ];
    }

    return config;
  },
};

export default nextConfig;
