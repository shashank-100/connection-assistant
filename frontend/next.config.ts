import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactCompiler: true,
  serverExternalPackages: ['playwright', 'playwright-core', '@sparticuz/chromium-min'],
};

export default nextConfig;
