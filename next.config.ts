import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['pdfkit'],
  output: 'standalone',
};

export default nextConfig;
