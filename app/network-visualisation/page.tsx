import type { Metadata, ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { NetworkVisualisation } from "@/app/network-visualisation/_components/network-visualisation";
import { MainContent } from "@/components/main-content";

interface NetworkVisualisationPageProps extends Record<string, never> {}

export async function generateMetadata(
	_props: Readonly<NetworkVisualisationPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const locale = await getLocale();
	const t = await getTranslations({ locale, namespace: "NetworkVisualisationPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function NetworkVisualisationPage(
	_props: Readonly<NetworkVisualisationPageProps>,
): Promise<ReactNode> {
	const t = await getTranslations("NetworkVisualisationPage");

	return (
		<MainContent className="relative grid grid-cols-[1fr_384px]">
			<h1 className="sr-only">{t("title")}</h1>
			<NetworkVisualisation />
		</MainContent>
	);
}
