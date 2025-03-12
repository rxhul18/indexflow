import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  images: {
    domains: ["avatars.githubusercontent.com", "github.com", "cdn.discordapp.com", "lh3.googleusercontent.com"],
  },
};

export default nextConfig;
