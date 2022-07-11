/** @typedef {import('next').NextConfig} NextConfig */
/** @typedef {import('webpack').Configuration} WebpackConfig */
/** @typedef {import('~/config/i18n.config').Locale} Locale */

import createBundleAnalyzerPlugin from '@next/bundle-analyzer'
import { log } from '@stefanprobst/log'

const locales = /** @type {Array<Locale>} */ (['en'])
const defaultLocale = /** @type {Locale} */ ('en')

const isProductionDeploy = process.env['NEXT_PUBLIC_BASE_URL'] === 'https://ica.acdh.oeaw.ac.at'

/** @type {NextConfig} */
const config = {
  eslint: {
    dirs: [process.cwd()],
    ignoreDuringBuilds: true,
  },
  experimental: {
    browsersListForSwc: true,
    images: { allowFutureImage: true },
    legacyBrowsers: false,
    newNextLinkBehavior: true,
  },
  headers() {
    const headers = [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        source: '/assets/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
    ]

    if (!isProductionDeploy) {
      headers.push({
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      })

      log.warn('Indexing by search engines is disallowed.')
    }

    return Promise.resolve(headers)
  },
  i18n: {
    defaultLocale,
    locales,
  },
  output: 'standalone',
  pageExtensions: ['page.tsx', 'api.ts'],
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(/** @type {WebpackConfig} */ config) {
    config.experiments = config.experiments ?? {}
    config.experiments.topLevelAwait = true

    return config
  },
}

/** @type {Array<(config: NextConfig) => NextConfig>} */
const plugins = [
  // @ts-expect-error Already fixed upstream.
  createBundleAnalyzerPlugin({ enabled: process.env['BUNDLE_ANALYZER'] === 'enabled' }),
]

export default plugins.reduce((config, plugin) => {
  return plugin(config)
}, config)
