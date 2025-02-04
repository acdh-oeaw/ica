import "@/styles/index.css";

import { cn } from "@acdh-oeaw/style-variants";
import type { Metadata, ResolvingMetadata, Viewport } from "next";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { LocalizedStringProvider as Translations } from "react-aria-components/i18n";
import { jsonLdScriptProps } from "react-schemaorg";

import { AppFooter } from "@/app/_components/app-footer";
import { AppHeader } from "@/app/_components/app-header";
import { AppLayout } from "@/app/_components/app-layout";
import { Providers } from "@/app/_components/providers";
import { id } from "@/components/main-content";
import { SkipLink } from "@/components/skip-link";
import { env } from "@/config/env.config";
import { AnalyticsScript } from "@/lib/analytics-script";
import * as fonts from "@/lib/fonts";

interface LocaleLayoutProps {
	children: ReactNode;
}

export const viewport: Viewport = {
	colorScheme: "light dark",
	initialScale: 1,
	width: "device-width",
};

export async function generateMetadata(
	_props: Omit<Readonly<LocaleLayoutProps>, "children">,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const locale = await getLocale();
	const meta = await getTranslations("metadata");

	const metadata: Metadata = {
		metadataBase: new URL(env.NEXT_PUBLIC_APP_BASE_URL),
		alternates: {
			canonical: "./",
		},
		title: {
			default: meta("title"),
			template: ["%s", meta("title")].join(" | "),
		},
		description: meta("description"),
		openGraph: {
			title: meta("title"),
			description: meta("description"),
			url: "./",
			siteName: meta("title"),
			locale,
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			creator: meta("twitter.creator"),
			site: meta("twitter.site"),
		},
		verification: {
			google: env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
		},
	};

	return metadata;
}

export default async function LocaleLayout(props: Readonly<LocaleLayoutProps>): Promise<ReactNode> {
	const { children } = props;

	const locale = await getLocale();
	const t = await getTranslations("LocaleLayout");
	const meta = await getTranslations("metadata");
	const messages = (await getMessages()) as IntlMessages;

	return (
		<html
			className={cn(fonts.body.variable, "bg-white font-body text-neutral-950 antialiased")}
			lang={locale}
			/**
			 * Suppressing hydration warning because we add `data-ui-color-scheme` before first paint.
			 */
			suppressHydrationWarning={true}
		>
			<body>
				{/* @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld */}
				<script
					{...jsonLdScriptProps({
						"@context": "https://schema.org",
						"@type": "WebSite",
						name: meta("title"),
						description: meta("description"),
					})}
				/>

				<AnalyticsScript baseUrl={env.NEXT_PUBLIC_MATOMO_BASE_URL} id={env.NEXT_PUBLIC_MATOMO_ID} />

				<SkipLink targetId={id}>{t("skip-to-main-content")}</SkipLink>

				{/**
				 * @see https://react-spectrum.adobe.com/react-aria/ssr.html#optimizing-bundle-size
				 *
				 * TODO: only include translations for components actually used
				 *
				 * @see https://react-spectrum.adobe.com/react-aria/ssr.html#advanced-optimization
				 */}
				<Translations locale={locale} />

				<Providers locale={locale} messages={messages}>
					<AppLayout>
						<AppHeader />
						{children}
						<AppFooter />
					</AppLayout>
				</Providers>
			</body>
		</html>
	);
}
