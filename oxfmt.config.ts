import { defineConfig } from "oxfmt";

export default defineConfig({
	ignorePatterns: [
		"pnpm-lock.yaml",
		"pnpm-workspace.yaml",
		"content/",
		"public/",
		"e2e/snapshots/",
		"*.mdx",
	],
	printWidth: 100,
	proseWrap: "always",
	sortImports: {
		groups: [
			["side_effect"],
			["side_effect_style"],
			["style"],
			["builtin"],
			["external"],
			["internal", "subpath"],
			["unknown"],
		],
	},
	sortPackageJson: { sortScripts: true },
	useTabs: true,
});
