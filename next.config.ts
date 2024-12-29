import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN,
    INSTAGRAM_BUSINESS_ACCOUNT_ID: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ['scontent.cdninstagram.com', 'lookaside.fbsbx.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["https://nextjs-14-0-2-bug-report-4ea064a57303.herokuapp.com"],
    }
  }
};

export default nextConfig;
