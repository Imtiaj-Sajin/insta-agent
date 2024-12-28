import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN,
    INSTAGRAM_BUSINESS_ACCOUNT_ID: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ['scontent.cdninstagram.com', 'lookaside.fbsbx.com', '**'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions:{
      allowedOrigins: [
        "http://localhost:3000",
        "https://nkf448kn-3000.asse.devtunnels.ms", // Trust the dev tunnel
      ],
      
    } 
    //serverActionsStrictOrigin: false, // Loosen strict origin checks in development
  },
};

export default nextConfig;
