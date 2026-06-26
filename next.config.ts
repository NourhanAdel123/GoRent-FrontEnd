import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://backend-go-rent.vercel.app/api/:path*",
      },
      {
        source: "/socket.io/:path*",
        destination: "https://backend-go-rent.vercel.app/socket.io/:path*",
      },
    ];
  },
};

export default nextConfig;
