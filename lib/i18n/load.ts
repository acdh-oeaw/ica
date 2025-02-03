import { defaultLocale, type Locale } from "@/config/i18n.config";
import type { Dictionaries } from "@/lib/i18n/dictionaries";

export async function load<K extends keyof Dictionaries>(
	locale: Locale = defaultLocale,
	namespaces: Array<K>,
): Promise<Pick<Dictionaries, K>> {
	const translations = await Promise.all(
		namespaces.map(async (namespace) => {
			switch (namespace) {
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				case "common":
					// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
					switch (locale) {
						default:
							return [
								namespace,
								await import("@/lib/i18n/common/en").then((module) => {
									return module.dictionary;
								}),
							] as const;
					}
				default:
					throw new Error("Unknown dictionary.");
			}
		}),
	);

	return Object.fromEntries(translations) as Pick<Dictionaries, K>;
}
