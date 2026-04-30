import path from "node:path";

import type { NextConfig } from "next";

const apiUrl = process.env.LOCAL_API_URL ?? "http://localhost:8080";
const apiDestination = apiUrl.replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiDestination}/api/:path*`,
      },
    ];
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src")],
  },
};

export default nextConfig;
