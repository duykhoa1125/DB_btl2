/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Dấu ** nghĩa là chấp nhận mọi domain
      },
      {
        protocol: 'http', // Thêm dòng này nếu cần load ảnh từ http thường
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;