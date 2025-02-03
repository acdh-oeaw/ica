import { log } from "@acdh-oeaw/lib";
import createBundleAnalyzerPlugin from "@next/bundle-analyzer";
import type { NextConfig } from "next";

import { defaultLocale, locales } from "@/config/i18n.config";

const config: NextConfig = {
	eslint: {
		dirs: [process.cwd()],
		ignoreDuringBuilds: true,
	},
	headers() {
		const headers = [
			{
				source: "/:path*",
				headers: [
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
					},
				],
			},
			{
				source: "/assets/fonts/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, immutable, max-age=31536000",
					},
				],
			},
		];

		if (process.env.NEXT_PUBLIC_BOTS !== "enabled") {
			headers.push({
				source: "/:path*",
				headers: [
					{
						key: "X-Robots-Tag",
						value: "noindex, nofollow",
					},
				],
			});

			log.warn("Indexing by search engines is disallowed.");
		}

		return Promise.resolve(headers);
	},
	i18n: {
		defaultLocale,
		locales: locales as ["en"],
	},
	output: "standalone",
	pageExtensions: ["page.tsx", "api.ts"],
	reactStrictMode: true,
	typescript: {
		ignoreBuildErrors: true,
	},
};

const plugins: Array<(config: NextConfig) => NextConfig> = [
	createBundleAnalyzerPlugin({ enabled: process.env.BUNDLE_ANALYZER === "enabled" }),
];

export default plugins.reduce((config, plugin) => {
	return plugin(config);
}, config);
