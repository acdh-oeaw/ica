import { type I18nService, useI18n as useInternationalisation } from "@stefanprobst/next-i18n";

import type { Dictionaries } from "@/lib/i18n/dictionaries";
import type { Locale } from "~/config/i18n.config";

export function useI18n<K extends keyof Dictionaries = never>(): I18nService<
	Pick<Dictionaries, K>,
	Locale
> {
	return useInternationalisation<Pick<Dictionaries, K>, Locale>();
}
