/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "dalleproduse.blob.core.windows.net",
            "dev.chasingwatts.com",
            "localhost:3000",
            "chasingwatts.com"
        ],
        minimumCacheTTL: 0,
        unoptimized:true,
    },
};

export default nextConfig;
