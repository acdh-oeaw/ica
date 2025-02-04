import { request } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { createImprintUrl } from "@/config/imprint.config";

interface ImprintPageProps extends Record<string, never> {}

export async function generateMetadata(
	_props: Readonly<ImprintPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const locale = await getLocale();
	const t = await getTranslations({ locale, namespace: "ImprintPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function ImprintPage(_props: Readonly<ImprintPageProps>): Promise<ReactNode> {
	const locale = await getLocale();
	const t = await getTranslations("ImprintPage");

	const html = await request(createImprintUrl(locale), { responseType: "text" });

	return (
		<MainContent className="prose-sm mx-auto w-full max-w-2xl py-12">
			<h1 className="text-3xl font-bold">{t("meta.title")}</h1>
			<div dangerouslySetInnerHTML={{ __html: html }} />
		</MainContent>
	);
}
