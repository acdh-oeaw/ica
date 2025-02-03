import { PageMetadata } from "@stefanprobst/next-page-metadata";
import { Fragment, type ReactNode } from "react";

import { HomeHeroSection } from "@/components/home-hero-section";
import { MainContent } from "@/components/main-content";
import { useI18n } from "@/lib/i18n/use-i18n";
import { withDictionaries } from "@/lib/i18n/with-dictionaries";
import { usePageTitleTemplate } from "@/lib/metadata/use-page-title-template";

export const getStaticProps = withDictionaries(["common"]);

export default function HomePage(): ReactNode {
	const { t } = useI18n<"common">();
	const titleTemplate = usePageTitleTemplate();

	const metadata = { title: t(["common", "pages", "home", "metadata", "title"]) };

	return (
		<Fragment>
			<PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
			<MainContent>
				<HomeHeroSection />
			</MainContent>
		</Fragment>
	);
}
