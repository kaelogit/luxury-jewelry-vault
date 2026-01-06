import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // ALLOWING EXTERNAL ASSETS
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ysejihzmlshvelsowztc.supabase.co', // Your specific project node
        port: '',
        pathname: '/storage/v1/object/public/**', // Whitelisting the public vault storage
      },
    ],
  },
  // OPTIONAL: Strengthening the Vault with Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Prevents clickjacking
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;