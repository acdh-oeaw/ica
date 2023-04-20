import { type FitEnum } from "sharp";

import { type Locale } from "~/config/i18n.config";

export interface AppMetadata {
	locale: Locale;
	title: string;
	shortTitle: string;
	description: string;
	logo: {
		path: string;
		maskable: boolean;
	};
	image: {
		path: string;
		alt: string;
		fit?: keyof FitEnum;
	};
	twitter: {
		handle: string;
	};
	creator: {
		name: string;
		shortName?: string;
		affiliation?: string;
		website: string;
		address?: {
			street: string;
			zip: string;
			city: string;
		};
		image?: {
			path: string;
			alt: string;
			fit?: keyof FitEnum;
		};
		phone?: string;
		email?: string;
		twitter?: {
			handle: string;
		};
	};
}

export const metadata: Record<Locale, AppMetadata> = {
	en: {
		locale: "en",
		title: "Ideas crossing the Atlantic",
		shortTitle: "ICA",
		description: "A Visualisation of Transatlantic Networks and Emigration from Central Europe",
		logo: {
			path: "./public/assets/images/logo.svg",
			maskable: false,
		},
		image: {
			path: "./public/assets/images/logo.svg",
			alt: "",
			fit: "contain",
		},
		twitter: {
			handle: "",
		},
		creator: {
			name: "Austrian Centre for Digital Humanities and Cultural Heritage",
			shortName: "ACDH-CH",
			website: "https://www.oeaw.ac.at/acdh",
		},
	},
};

export const manifestFileName = "app.webmanifest";

export const openGraphImageName = "image.webp";
