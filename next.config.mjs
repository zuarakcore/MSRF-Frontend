/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The VPS runs `node server.js` from .next/standalone inside Docker (see Dockerfile).
  // Not on Vercel: Next 16.3.0-16.3.4 skip writing .next/next-server.js.nft.json when standalone is
  // combined with Vercel's build adapter, and the build fails (vercel/next.js#96646).
  ...(process.env.VERCEL ? {} : { output: 'standalone' }),
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
