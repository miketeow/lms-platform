import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Allow Unsplash (Seed Data)
      },
      {
        hostname: "mike-lms-platform.t3.storage.dev",
        port: "",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
