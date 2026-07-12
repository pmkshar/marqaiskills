/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  // Ensure data files and skill directories are included in Vercel serverless bundle
  serverExternalPackages: ['bcryptjs'],
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs'],
    outputFileTracingIncludes: {
      '/*': ['./data/**/*'],
    },
  },
}

module.exports = nextConfig
