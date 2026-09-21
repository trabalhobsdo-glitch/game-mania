/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Todas as imagens ficam em /public — nenhum domínio externo é necessário.
  },
};

export default nextConfig;
