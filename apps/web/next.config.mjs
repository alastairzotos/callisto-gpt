/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    NEXT_PUBLIC_DEFAULT_SERVER_URL: process.env.NEXT_PUBLIC_DEFAULT_SERVER_URL,
  }
};

export default nextConfig;
