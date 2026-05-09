import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d451q7kfz4osw.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
