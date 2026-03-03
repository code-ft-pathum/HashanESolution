import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@openrouter/sdk"],
  serverExternalPackages: ["@openrouter/sdk"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
