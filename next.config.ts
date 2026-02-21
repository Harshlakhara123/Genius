import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
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
