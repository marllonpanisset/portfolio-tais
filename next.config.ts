import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx"],

  images: {
    formats: ["image/avif", "image/webp"],
  },

  typedRoutes: true,
};

export default nextConfig;
