import type { NextConfig } from "next";

const apiUrl = process.env.API_URL || "http://10.0.4.37:5281/api";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.0.4.37', '10.0.4.37:3000'],
  
  
  async rewrites() {
    return [
      {
        source: '/api-backend/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;