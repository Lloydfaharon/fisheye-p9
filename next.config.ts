import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  serverExternalPackages: [
    "@prisma/client",
    "prisma",
    "better-sqlite3",
  ],

  outputFileTracingIncludes: {
    "/*": [
      "app/generated/prisma/**/*",
      "prisma/**/*",
    ],
  },

  outputFileTracingExcludes: {
    "*": [
      "node_modules/@swc/core-linux-x64-gnu",
      "node_modules/@swc/core-linux-x64-musl",
      "node_modules/@esbuild/**",
      "node_modules/webpack/**",
      "node_modules/terser/**",
    ],
  },
};

export default nextConfig;