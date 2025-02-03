import type { GetServerSideProps, GetStaticProps, PreviewData } from "next";
import type { ParsedUrlQuery } from "querystring";

import type { Dictionaries } from "@/lib/i18n/dictionaries";
import { load } from "@/lib/i18n/load";
import type { Locale } from "~/config/i18n.config";

export function withDictionaries<
	P extends Record<string, unknown>,
	Q extends ParsedUrlQuery,
	D extends PreviewData,
>(keys: Array<keyof Dictionaries>, fn?: GetServerSideProps<P, Q, D> | GetStaticProps<P, Q, D>) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return async function getProps(context: any) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		const locale = context.locale as Locale;
		const dictionaries = await load(locale, keys);

		if (fn == null) {
			return { props: { dictionaries } };
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const result = await fn(context);

		if ("props" in result) {
			// eslint-disable-next-line @typescript-eslint/no-misused-spread, @typescript-eslint/no-misused-promises
			return { ...result, props: { ...result.props, dictionaries } };
		}

		return result;
	};
}
