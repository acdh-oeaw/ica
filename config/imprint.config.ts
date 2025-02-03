import { assert, createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";

import type { Locale } from "~/config/i18n.config";

const redmineId = process.env.NEXT_PUBLIC_REDMINE_ID;

/**
 * @see https://github.com/acdh-oeaw/imprint-service
 */
export function createImprintUrl(locale: Locale): URL {
	assert(
		redmineId != null,
		"Failed to generate imprint. Please provide a redmine service issue id via the NEXT_PUBLIC_REDMINE_ID environment variable.",
	);

	return createUrl({
		baseUrl: "https://imprint.acdh.oeaw.ac.at",
		pathname: `/${redmineId}`,
		searchParams: createUrlSearchParams({ locale }),
	});
}
