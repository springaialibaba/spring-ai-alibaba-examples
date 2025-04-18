import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	compress: false,
	/* config options here */
	async rewrites() {
		return [
			{
				source: "/api/stream/:path*", // 前端请求路径
				destination: "http://localhost:8848/stream/:path*", // 实际后端地址
			},
		];
	},
};

export default nextConfig;
