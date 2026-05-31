/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    staleTimes: {
      // Cache dynamic pages in the client-side router cache for 30 seconds.
      // This means navigating back-and-forth between dashboard/boards
      // is instant for 30s without re-fetching from the server.
      dynamic: 30,
    },
  },
};

export default nextConfig;
