// apps/public/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@havenova/components',
    '@havenova/contexts',
    '@havenova/hooks',
    '@havenova/services',
    '@havenova/utils',
    '@havenova/i18n',
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
