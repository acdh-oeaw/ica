import type { Metadata, ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { GeoVisualisation } from "@/app/geo-visualisation/geo-visualisation";
import { MainContent } from "@/components/main-content";

interface GeoVisualisationPageProps extends Record<string, never> {}

export async function generateMetadata(
	_props: Readonly<GeoVisualisationPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const locale = await getLocale();
	const t = await getTranslations({ locale, namespace: "GeoVisualisationPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function GeoVisualisationPage(
	_props: Readonly<GeoVisualisationPageProps>,
): Promise<ReactNode> {
	const t = await getTranslations("GeoVisualisationPage");

	return (
		<MainContent className="relative grid grid-cols-[1fr_384px]">
			<h1 className="sr-only">{t("title")}</h1>
			<GeoVisualisation />
		</MainContent>
	);
}
