/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "dalleproduse.blob.core.windows.net",
      "dev.chasingwatts.com",
      "localhost:3000",
      "chasingwatts.com",
    ],
    minimumCacheTTL: 0,
    unoptimized: true,
  },
  async headers() {
    return [
      {
        // Match all API routes
        source: "/apple-app-site-association",
        headers: [
          {
            key: "Content-Type",
            value: "application/json",
          },
        ],
      },
    ];
  }
};

export default nextConfig;
