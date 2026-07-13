/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Permite los recursos de desarrollo (HMR) desde el host del preview de v0.
  allowedDevOrigins: ['*.vercel.run', '*.v0.dev', '*.v0.app'],
}

export default nextConfig
