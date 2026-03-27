/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/skill',
  images: {
    domains: ['images.unsplash.com', 'picsum.photos'],
    unoptimized: true,
  },
};

module.exports = nextConfig;
