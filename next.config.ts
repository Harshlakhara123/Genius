import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // Defines optimized sizes to reduce Vercel bandwidth allocation
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Put the host name here when required (e.g., OpenAI image URLs)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oaidalleapiprodscus.blob.core.windows.net", // Typical OpenAI image hostname, can be changed if a mismatch error
      },
    ]
  }
};

export default nextConfig;
