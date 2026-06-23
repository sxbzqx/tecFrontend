import type { NextConfig } from "next";

const apiUrl = process.env.API_URL;

const nextConfig: NextConfig = {
  devIndicators: false,

  allowedDevOrigins: ["10.0.4.37"],

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
