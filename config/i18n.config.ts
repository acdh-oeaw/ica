import { type Formats, hasLocale } from "next-intl";
import { defineRouting, type LocalePrefix } from "next-intl/routing";

// import type metadataDe from "@/content/de/metadata/index.json";
import type metadataEn from "@/content/en/metadata/index.json";
// import type de from "@/messages/de.json";
import type en from "@/messages/en.json";

export const locales = ["en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isValidLocale(value: unknown): value is Locale {
	return hasLocale(locales, value);
}

export const localePrefix = {
	mode: "always",
	prefixes: {
		en: "/en",
	},
} satisfies LocalePrefix<typeof locales>;

export const routing = defineRouting({
	locales,
	defaultLocale,
	localePrefix,
});

export type IntlMessages = typeof en & { metadata: typeof metadataEn };

export interface IntlTranslations extends Record<Locale, IntlMessages> {
	// de: typeof de & { metadata: typeof metadataDe };
	en: typeof en & { metadata: typeof metadataEn };
}

export const formats = {
	dateTime: {
		long: {
			dateStyle: "long",
		},
	},
	list: {
		enumeration: {
			style: "long",
			type: "conjunction",
		},
	},
} satisfies Formats;

export type IntlFormats = typeof formats;
