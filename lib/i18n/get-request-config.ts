import "server-only";

import { getRequestConfig } from "next-intl/server";

import { defaultLocale, formats, type IntlMessages, isValidLocale } from "@/config/i18n.config";

// next-intl requires a default export for its request configuration.
// oxlint-disable-next-line import/no-default-export
export default getRequestConfig(async ({ requestLocale }) => {
	const _locale = await requestLocale;
	const locale = isValidLocale(_locale) ? _locale : defaultLocale;

	const timeZone = "UTC";

	// oxlint-disable-next-line typescript/no-unsafe-assignment
	const _messages = await import(`@/messages/${locale}.json`);

	// oxlint-disable-next-line typescript/no-unsafe-assignment
	const _metadata = await import(`@/content/${locale}/metadata/index.json`);

	// oxlint-disable-next-line typescript/no-unsafe-assignment, typescript/no-unsafe-member-access
	const messages = { metadata: _metadata.default, ..._messages.default } as IntlMessages;

	return {
		formats,
		locale,
		messages,
		timeZone,
	};
});
