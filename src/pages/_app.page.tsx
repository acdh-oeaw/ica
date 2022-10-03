import '@fontsource/inter/variable-full.css'
import 'tailwindcss/tailwind.css'
import '@/styles/index.css'
import '@/styles/nprogress.css'

import { ErrorBoundary } from '@stefanprobst/next-error-boundary'
import { PageMetadata } from '@stefanprobst/next-page-metadata'
import type { NextWebVitalsMetric } from 'next/app'
import Head from 'next/head'
import { Fragment } from 'react'

import { AnalyticsScript } from '@/app/analytics/analytics-script'
import { reportPageView } from '@/app/analytics/analytics-service'
import type { AppProps, GetLayout } from '@/app/app.types'
import { useAppMetadata } from '@/app/metadata/use-app-metadata'
import { Notifications } from '@/app/notifications/notifications'
import { PageLayout } from '@/app/page.layout'
import { Providers } from '@/app/providers.context'
import { RootErrorBoundaryFallback } from '@/app/root-error-boundary-fallback.component'
import { useAlternateLanguageUrls } from '@/app/route/use-alternate-language-urls'
import { useCanonicalUrl } from '@/app/route/use-canonical-url'
import { useLocale } from '@/app/route/use-locale'
import { usePageLoadProgressIndicator } from '@/app/use-page-load-progress-indicator'
import { createAppUrl } from '@/lib/create-app-url'
import { createAssetLink } from '@/lib/create-asset-link'
import { manifestFileName, openGraphImageName } from '~/config/metadata.config'

export default function App(props: AppProps): JSX.Element {
  const { Component, pageProps } = props

  const { locale } = useLocale()
  const metadata = useAppMetadata()
  const canonicalUrl = useCanonicalUrl()
  const alternateLanguageUrls = useAlternateLanguageUrls()
  usePageLoadProgressIndicator()

  const getLayout = Component.getLayout ?? getDefaultLayout

  return (
    <Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href={createAssetLink({ locale, pathname: '/favicon.ico' })} sizes="any" />
        <link
          rel="icon"
          href={createAssetLink({ locale, pathname: '/icon.svg' })}
          type="image/svg+xml"
        />
        <link
          rel="apple-touch-icon"
          href={createAssetLink({ locale, pathname: 'apple-touch-icon.png' })}
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
          type: 'website',
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
        <Providers {...pageProps}>
          {getLayout(<Component {...pageProps} />, pageProps)}
          <Notifications />
        </Providers>
      </ErrorBoundary>
    </Fragment>
  )
}

const getDefaultLayout: GetLayout = function getDefaultLayout(page, pageProps) {
  return <PageLayout {...pageProps}>{page}</PageLayout>
}

export function reportWebVitals(metric: NextWebVitalsMetric): void {
  switch (metric.name) {
    case 'Next.js-hydration':
      /** Register right after hydration. */
      break
    case 'Next.js-route-change-to-render':
      /** Register page views after client-side transitions. */
      reportPageView()
      break
    default:
      break
  }
}
