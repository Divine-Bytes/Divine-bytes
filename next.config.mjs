/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
    // In development, serve local uploads unoptimized
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
