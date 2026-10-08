import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The dev server's image optimiser can leave a request pending when several cards ask for the same cover at
  // once (four books share one cover), which stalled the local Playwright runs. Production builds still optimise.
  images: { unoptimized: process.env.NODE_ENV === "development" },
  // The catalog is the home screen; keep "/" working for the demo link.
  async redirects() {
    return [{ source: "/", destination: "/books/list", permanent: false }];
  },
};

export default nextConfig;
