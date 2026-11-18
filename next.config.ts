import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // AVIF is smaller; browsers without AVIF support get WebP.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
