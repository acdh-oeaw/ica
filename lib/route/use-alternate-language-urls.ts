import { createUrlSearchParams, type CreateUrlSearchParamsParams } from "@acdh-oeaw/lib";
import { useMemo } from "react";

import type { Locale } from "@/config/i18n.config";
import { createAppUrl } from "@/lib/create-app-url";
import { useLocale } from "@/lib/route/use-locale";
import { usePathname } from "@/lib/route/use-pathname";

export type UseAlternateLanguageUrlsResult = Array<{ hrefLang: Locale; href: string }>;

export function useAlternateLanguageUrls(
	searchParams?: CreateUrlSearchParamsParams,
): UseAlternateLanguageUrlsResult {
	const { locales } = useLocale();
	const { pathname } = usePathname();

	const urls = useMemo(() => {
		return locales.map((locale) => {
			const url = createAppUrl({
				locale,
				pathname,
				searchParams: searchParams != null ? createUrlSearchParams(searchParams) : undefined,
				hash: undefined,
			});

			return { hrefLang: locale, href: String(url) };
		});
	}, [locales, pathname, searchParams]);

	return urls;
}
