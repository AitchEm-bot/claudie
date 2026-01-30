/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: __dirname,
  turbopack: {
    root: __dirname,
  },
}

module.exports = nextConfig
