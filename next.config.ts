import localesPlugin from "@react-aria/optimize-locales-plugin";
import type { NextConfig } from "next";
import createI18nPlugin from "next-intl/plugin";

import { env } from "@/config/env.config";

const config: NextConfig = {
	/** Compression should be handled by traefik reverse proxy. */
	compress: false,
	headers() {
		/** @type {Awaited<ReturnType<NonNullable<NextConfig["headers"]>>>} */
		const headers = [
			/** @see https://nextjs.org/docs/app/building-your-application/deploying#streaming-and-suspense */
			{
				source: "/:path*{/}?",
				headers: [
					{
						key: "X-Accel-Buffering",
						value: "no",
					},
				],
			},
		];

		return Promise.resolve(headers);
	},
	images: {
		deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	output: env.BUILD_MODE,
	typescript: {
		ignoreBuildErrors: true,
	},
	turbopack: {
		rules: {
			...localesPlugin.turbopack([{ locales: [], condition: "browser" }]).rules,
			"*.css": {
				loaders: ["@tailwindcss/turbopack"],
				as: "*.css",
			},
		},
	},
};

const plugins: Array<(config: NextConfig) => NextConfig> = [
	createI18nPlugin({
		experimental: {
			/** @see https://v4.next-intl.dev/docs/workflows/typescript#messages-arguments */
			createMessagesDeclaration: "./messages/en.json",
		},
		requestConfig: "./lib/i18n/get-request-config.ts",
	}),
];

export default plugins.reduce((config, plugin) => {
	return plugin(config);
}, config);
