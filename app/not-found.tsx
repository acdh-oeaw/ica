import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";

interface NotFoundPageProps extends Record<string, never> {}

export async function generateMetadata(
	_props: Readonly<NotFoundPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations("NotFoundPage");

	const metadata: Metadata = {
		title: t("meta.title"),
		/**
		 * Automatically set by next.js.
		 *
		 * @see https://nextjs.org/docs/app/api-reference/functions/not-found
		 */
		// robots: {
		// 	index: false,
		// },
	};

	return metadata;
}

export default function NotFoundPage(_props: Readonly<NotFoundPageProps>): ReactNode {
	const t = useTranslations("NotFoundPage");

	return (
		<MainContent className="bg-background">
			<section className="h-full grid place-content-center place-items-center gap-y-6 py-16 xs:py-24">
				<h1 className="text-balance text-center text-4xl font-bold">{t("title")}</h1>
			</section>
		</MainContent>
	);
}
