/* eslint-disable check-file/filename-naming-convention */

import "@fontsource/inter/variable-full.css";
import "tailwindcss/tailwind.css";
import "@/styles/index.css";
import "@/styles/nprogress.css";

import { ErrorBoundary } from "@stefanprobst/next-error-boundary";
import { PageMetadata } from "@stefanprobst/next-page-metadata";
import type { NextWebVitalsMetric } from "next/app";
import Head from "next/head";
import { Fragment, type ReactNode } from "react";

import { PageLayout } from "@/components/page.layout";
import { RootErrorBoundaryFallback } from "@/components/root-error-boundary-fallback";
import { AnalyticsScript } from "@/lib/analytics/analytics-script";
import { reportPageView } from "@/lib/analytics/analytics-service";
import type { AppProps, GetLayout } from "@/lib/app.types";
import { createAppUrl } from "@/lib/create-app-url";
import { createAssetLink } from "@/lib/create-asset-link";
import { useAppMetadata } from "@/lib/metadata/use-app-metadata";
import { Providers } from "@/lib/providers.context";
import { useAlternateLanguageUrls } from "@/lib/route/use-alternate-language-urls";
import { useCanonicalUrl } from "@/lib/route/use-canonical-url";
import { useLocale } from "@/lib/route/use-locale";
import { usePageLoadProgressIndicator } from "@/lib/use-page-load-progress-indicator";
import { manifestFileName, openGraphImageName } from "~/config/metadata.config";

export default function App(props: AppProps): ReactNode {
	const { Component, pageProps } = props;

	const { locale } = useLocale();
	const metadata = useAppMetadata();
	const canonicalUrl = useCanonicalUrl();
	const alternateLanguageUrls = useAlternateLanguageUrls();
	usePageLoadProgressIndicator();

	const getLayout = Component.getLayout ?? getDefaultLayout;

	return (
		<Fragment>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="color-scheme" content="light dark" />
				<link rel="icon" href={createAssetLink({ locale, pathname: "/favicon.ico" })} sizes="any" />
				<link
					rel="icon"
					href={createAssetLink({ locale, pathname: "/icon.svg" })}
					type="image/svg+xml"
				/>
				<link
					rel="apple-touch-icon"
					href={createAssetLink({ locale, pathname: "apple-touch-icon.png" })}
				/>
				<link rel="manifest" href={String(createAppUrl({ locale, pathname: manifestFileName }))} />
			</Head>
			<PageMetadata
				canonicalUrl={String(canonicalUrl)}
				language={metadata.locale}
				languageAlternates={alternateLanguageUrls}
				title={metadata.title}
				description={metadata.description}
				openGraph={{
					type: "website",
					siteName: metadata.title,
					images: [
						{
							src: createAssetLink({ locale, pathname: openGraphImageName }),
							alt: metadata.image.alt,
						},
					],
				}}
				twitter={metadata.twitter}
			/>
			<AnalyticsScript />
			<ErrorBoundary fallback={<RootErrorBoundaryFallback />}>
				<Providers {...pageProps}>{getLayout(<Component {...pageProps} />, pageProps)}</Providers>
			</ErrorBoundary>
		</Fragment>
	);
}

const getDefaultLayout: GetLayout = function getDefaultLayout(page, pageProps) {
	return <PageLayout {...pageProps}>{page}</PageLayout>;
};

export function reportWebVitals(metric: NextWebVitalsMetric): void {
	// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
	switch (metric.name) {
		case "Next.js-hydration":
			/** Register right after hydration. */
			break;

		case "Next.js-route-change-to-render":
			/** Register page views after client-side transitions. */
			reportPageView();
			break;

		default:
			break;
	}
}
