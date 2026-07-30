/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ["@repo/api-client", "@repo/db", "@repo/lib", "@repo/ui"],
  eslint: {
    // 部署時跳過 Lint 檢查，因為我們在 package.json 已經有 lint 指令了
    // 這樣可以確保 build 流程不會被舊的配置警告卡住
    ignoreDuringBuilds: true,
  },
  typescript: { ignoreBuildErrors: true },
  images: {
    domains: [
      "placehold.co",
      "picsum.photos",
      "res.cloudinary.com",
      "images.unsplash.com",
    ], //允許的圖片網域
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
