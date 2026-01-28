import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. TURBOPACK OPTIMIZATION (Optional but recommended for v16)
  // This helps resolve the "root directory" confusion you saw in your logs
  // turbopack: {
  //   root: '.',
  // },

  images: {
    minimumCacheTTL: 3600,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'], 

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'ysejihzmlshvelsowztc.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // Keep this during development, remove once all assets are migrated
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;