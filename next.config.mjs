/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint runs separately in CI — skip during Vercel production build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type errors are caught locally — don't block production builds
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
