import { PageMetadata } from "@stefanprobst/next-page-metadata";
import { request } from "@stefanprobst/request";
import { type GetStaticPropsContext, type GetStaticPropsResult } from "next";
import { Fragment } from "react";

import { MainContent } from "@/components/main-content";
import { useI18n } from "@/lib/i18n/use-i18n";
import { withDictionaries } from "@/lib/i18n/with-dictionaries";
import { usePageTitleTemplate } from "@/lib/metadata/use-page-title-template";
import { type Locale } from "~/config/i18n.config";
import { createImprintUrl } from "~/config/imprint.config";

export namespace ImprintPage {
	export type Props = {
		html: string;
	};
}

export const getStaticProps = withDictionaries(
	["common"],
	async function getStaticProps(
		context: GetStaticPropsContext,
	): Promise<GetStaticPropsResult<ImprintPage.Props>> {
		const locale = context.locale as Locale;
		const html = (await request(createImprintUrl(locale), { responseType: "text" })) as string;

		return { props: { html } };
	},
);

export default function ImprintPage(props: ImprintPage.Props): JSX.Element {
	const { html } = props;

	const { t } = useI18n<"common">();
	const titleTemplate = usePageTitleTemplate();

	const metadata = { title: t(["common", "pages", "imprint", "metadata", "title"]) };

	return (
		<Fragment>
			<PageMetadata nofollow noindex title={metadata.title} titleTemplate={titleTemplate} />
			<MainContent className="prose-sm mx-auto w-full max-w-2xl py-12">
				<h1 className="text-3xl font-bold">{metadata.title}</h1>
				<div dangerouslySetInnerHTML={{ __html: html }} />
			</MainContent>
		</Fragment>
	);
}
