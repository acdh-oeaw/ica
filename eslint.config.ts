import baseConfig from "@acdh-oeaw/eslint-config";
// import nextConfig from "@acdh-oeaw/eslint-config-next";
import playwrightConfig from "@acdh-oeaw/eslint-config-playwright";
import reactConfig from "@acdh-oeaw/eslint-config-react";
import tailwindcssConfig from "@acdh-oeaw/eslint-config-tailwindcss";
import gitignore from "eslint-config-flat-gitignore";
// @ts-expect-error Missing type declaration.
import checkFilePlugin from "eslint-plugin-check-file";
import type { Config } from "typescript-eslint";

const config: Config = [
	gitignore({ strict: false }),
	...baseConfig,
	...reactConfig,
	// ...nextConfig,
	...tailwindcssConfig,
	...playwrightConfig,
	{
		plugins: {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			"check-file": checkFilePlugin,
		},
		rules: {
			"check-file/filename-naming-convention": [
				"error",
				{
					"**/*": "KEBAB_CASE",
				},
				{ ignoreMiddleExtensions: true },
			],
			"check-file/folder-naming-convention": [
				"error",
				{
					"**/": "NEXT_JS_APP_ROUTER_CASE",
				},
			],
		},
	},
];

export default config;
