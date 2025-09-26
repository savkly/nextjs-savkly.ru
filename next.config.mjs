/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    async rewrites() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
      },
      // Убедитесь, что нет редиректов на самих себя
    ]
  }
};

export default nextConfig;
