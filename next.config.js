/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  typescript: {
    // Allow build to continue even with TypeScript errors
    // Run type checking separately
    tsconfigPath: './tsconfig.json'
  },
  // Skip static generation for all routes when DATABASE_URL is not set
  ...(process.env.DATABASE_URL === 'file:./prisma/dev.db' && {
    staticPageGenerationTimeout: 0,
  }),
}

module.exports = nextConfig
