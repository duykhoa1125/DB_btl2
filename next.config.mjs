/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Tắt Image Optimization để tránh lỗi 403 từ external sources
    remotePatterns: [
      // --- Config cũ của bạn ---
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },

      // --- Config MỚI thêm vào (Dựa trên data SQL) ---
      {
        protocol: "https",
        hostname: "mediaproxy.tvtropes.org", // Ảnh Avengers: Endgame
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com", // Ảnh Tình Người Duyên Ma (Youtube thumbnail)
      },
      {
        protocol: "https",
        hostname: "resizing.flixster.com", // Ảnh Spider-Man
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com", // Ảnh Fast & Furious 10
      },
      {
        protocol: "https",
        hostname: "cdn.tgdd.vn", // Ảnh Bố Già (Thế Giới Di Động CDN)
      },
    ],
  },
};

export default nextConfig;
