import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the tracing root so a stray lockfile elsewhere on the machine
  // doesn't get picked up as the workspace root.
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
