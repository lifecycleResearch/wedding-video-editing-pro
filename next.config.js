const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    unoptimized: true,
  },
}

module.exports = nextConfig
