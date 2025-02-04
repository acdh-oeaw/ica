import typographyPlugin from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import animatePlugin from "tailwindcss-animate";
import racPlugin from "tailwindcss-react-aria-components";

const config: Config = {
	content: ["./@(app|components|styles)/**/*.@(css|ts|tsx)"],
	theme: {
		extend: {
			colors: {
				neutral: { 0: colors.white, ...colors.slate, 1000: colors.black },
				primary: colors.slate,
			},
			fontFamily: {
				body: ["var(--_font-body, ui-sans-serif)", "system-ui", "sans-serif"],
			},
			screens: {
				xs: "480px",
			},
			zIndex: {
				dialog: "var(--z-index-dialog)",
				overlay: "var(--z-index-overlay)",
			},
		},
	},
	plugins: [animatePlugin, racPlugin, typographyPlugin],
};

export default config;
