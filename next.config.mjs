/** @type {import('next').NextConfig} */
const nextConfig = {
    output:"standalone",
    images: {
        domains: ['dalleproduse.blob.core.windows.net'],
      },
};

export default nextConfig;
