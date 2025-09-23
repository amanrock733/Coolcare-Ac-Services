/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore ESLint errors during `next build` so production builds aren't blocked by lint.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
