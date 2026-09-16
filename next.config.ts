import type { NextConfig } from 'next';

/**
 * Same deployment shape as the live site: a fully static export served straight
 * off Netlify, so there is no serverless runtime and no image optimisation
 * service to pay for. `trailingSlash` keeps the exported directory layout
 * (`/index.html`) aligned with how Netlify resolves paths.
 */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
