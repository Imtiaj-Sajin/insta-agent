import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN,
    INSTAGRAM_BUSINESS_ACCOUNT_ID: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
  },
};

export default nextConfig;
