import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Service worker source file (we create this in public/sw.ts → compiled to public/sw.js)
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  // Disable in development so hot-reload works normally
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Strict mode helps catch bugs early
  reactStrictMode: true,
};

export default withSerwist(nextConfig);
