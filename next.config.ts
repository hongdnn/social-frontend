import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [`${process.env.NEXT_PUBLIC_S3_BUCKET_DOMAIN}`], 
  },
};

export default withNextIntl(nextConfig);
