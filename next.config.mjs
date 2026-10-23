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
      },
      // `next dev` only: the browser calls /api/v1 on localhost and this forwards it to the real API
      // (production CORS doesn't allow localhost). See REQUEST_BASE_URL in src/lib/api.ts.
      ...(process.env.NODE_ENV === 'development'
        ? [{
            source: '/api/v1/:path*',
            destination: `${(process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.malabarchallengersfc.com/api/v1').replace(/\/+$/, '')}/:path*`
          }]
        : [])
    ]
  }
};

export default nextConfig;
