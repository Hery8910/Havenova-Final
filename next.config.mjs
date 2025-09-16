// next.config.mjs
import withPWA from 'next-pwa';

const isDev = process.env.NODE_ENV === 'development';
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com'], // ejemplo, ajusta según necesites
  },
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'de',
  },
  // 👇 NO pongas esta 'images' dentro de `pwa`, solo debe estar aquí
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isDev,
})(nextConfig);
