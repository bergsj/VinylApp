import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.discogs.com" },
      { protocol: "https", hostname: "img.discogs.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "vinylapp.corp.fjall.nl" },
      { protocol: "https", hostname: "vinylapp.corp.fjall.nl" },
    ],
  },
};

export default nextConfig;
