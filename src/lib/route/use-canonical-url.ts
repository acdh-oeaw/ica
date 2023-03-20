import type { UrlSearchParamsInit } from "@stefanprobst/request";
import { useMemo } from "react";

import { createAppUrl } from "@/lib/create-app-url";
import { useLocale } from "@/lib/route/use-locale";
import { usePathname } from "@/lib/route/use-pathname";

export function useCanonicalUrl(searchParams?: UrlSearchParamsInit): URL {
	const { pathname } = usePathname();
	const { locale } = useLocale();

	const url = useMemo(() => {
		const url = createAppUrl({
			locale,
			pathname,
			searchParams,
			hash: undefined,
		});

		return url;
	}, [locale, pathname, searchParams]);

	return url;
}
