/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Ensure static exports work correctly
  output: 'export',
  // Since we're using static export, we need to disable image optimization
  images: {
    unoptimized: true,
  },
};

export default nextConfig; 