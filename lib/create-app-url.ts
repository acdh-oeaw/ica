import { createUrl, type CreateUrlParams } from "@acdh-oeaw/lib";

import { env } from "@/config/env.config";
import type { Locale } from "@/config/i18n.config";
import { createLocalePathname } from "@/lib/create-locale-pathname";

export interface CreateAppUrlArgs extends Omit<CreateUrlParams, "baseUrl"> {
	locale?: Locale;
}

export function createAppUrl(args: CreateAppUrlArgs): URL {
	const pathname = createLocalePathname(args.pathname, args.locale);
	return createUrl({
		...args,
		baseUrl: env.NEXT_PUBLIC_APP_BASE_URL,
		pathname,
	});
}
