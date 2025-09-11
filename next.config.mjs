// next.config.mjs
import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com'], // ejemplo, ajusta según necesites
  },
  i18n: {
    locales: ['en', 'de', 'es'],
    defaultLocale: 'de',
  },
  // 👇 NO pongas esta 'images' dentro de `pwa`, solo debe estar aquí
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // ❌ NO agregues `images` aquí
  // ✅ Puedes usar 'mode' si deseas algo como:
  // mode: 'production'
})(nextConfig);
