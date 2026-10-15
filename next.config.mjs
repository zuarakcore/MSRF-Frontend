/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Production runs `node server.js` from .next/standalone inside Docker (see Dockerfile).
  output: 'standalone',
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: '/__l5e/:path*',
        destination: 'https://id-preview--f24204c3-2c7a-4f74-b654-ff5be08cfd9d.lovable.app/__l5e/:path*'
      }
    ]
  }
};

export default nextConfig;
