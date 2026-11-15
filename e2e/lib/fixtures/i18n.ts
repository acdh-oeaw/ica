import type { Page } from "@playwright/test";
import { createFormatter, createTranslator } from "next-intl";

import { defaultLocale, type IntlMessages } from "@/config/i18n.config";

export interface I18n {
	t: ReturnType<typeof createTranslator<IntlMessages>>;
	format: ReturnType<typeof createFormatter>;
}

export async function createI18n(_page: Page, locale = defaultLocale): Promise<I18n> {
	// oxlint-disable-next-line typescript/no-unsafe-assignment
	const _messages = await import(`@/messages/${locale}.json`, { with: { type: "json" } });

	// oxlint-disable-next-line typescript/no-unsafe-assignment
	const _metadata = await import(`@/content/${locale}/metadata/index.json`, {
		with: { type: "json" },
	});

	// oxlint-disable-next-line typescript/no-unsafe-member-access, typescript/no-unsafe-assignment
	const messages = { metadata: _metadata.default, ..._messages.default } as IntlMessages;

	return {
		t: createTranslator({ locale, messages }),
		format: createFormatter({ locale }),
	};
}

export type WithI18n<T> = T & { i18n: I18n };
