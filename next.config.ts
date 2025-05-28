import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // loader: 'custom',
    // loaderFile: './src/utils/loader.js',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'brave.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
