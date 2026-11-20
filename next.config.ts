
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/auth/:path*",
          destination:
            "https://fixmate-server-khaki.vercel.app/api/auth/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
