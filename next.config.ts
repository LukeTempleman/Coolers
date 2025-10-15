import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Hardcoded environment variables for demo
    NEXTAUTH_SECRET: "hardcoded-secret-for-demo-app-2024-cooler-tracker-production",
    NEXTAUTH_URL: process.env.NODE_ENV === 'production' 
      ? "https://arctic-eye.netlify.app" 
      : "http://localhost:3000",
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: "pk.eyJ1IjoiemFjYXJpbmJhbHlhIiwiYSI6ImNtZ2dmMzJ2OTBoamIyanA5eG9lZG5ucTkifQ.x7zXdwwVOH6vnajW5XKjFg",
    NEXT_PUBLIC_USE_MOCK_AUTH: "true",
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
