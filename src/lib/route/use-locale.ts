import { useRouter } from "next/router";

import { type Locale, type Locales } from "~/config/i18n.config";

export interface UseLocaleResult {
	defaultLocale: Locale;
	locale: Locale;
	locales: Locales;
}

export function useLocale(): UseLocaleResult {
	const { defaultLocale, locale, locales } = useRouter();

	return { defaultLocale, locale, locales } as unknown as UseLocaleResult;
}
