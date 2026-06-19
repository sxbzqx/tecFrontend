import type { NextConfig } from "next";

const apiUrl = process.env.API_URL;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api-backend/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
