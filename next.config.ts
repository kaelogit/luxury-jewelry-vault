import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. INCREASE UPLOAD LIMIT (The Fix for "Something went wrong")
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // Default is 1MB. We need this for Videos/3D Models.
    },
  },

  // 2. IMAGE OPTIMIZATION
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
        // Your specific Supabase project
        protocol: 'https',
        hostname: 'ysejihzmlshvelsowztc.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // Wildcard fallback for flexibility
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  
  // 3. SECURITY HEADERS
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