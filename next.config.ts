import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow these native packages to skip webpack bundling
  serverExternalPackages: ["pdf-parse", "mammoth"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
