/** @typedef {import('next').NextConfig} NextConfig */
/** @typedef {import('~/config/i18n.config').Locale} Locale */

import createBundleAnalyzerPlugin from '@next/bundle-analyzer'
import { log } from '@stefanprobst/log'

const locales = /** @type {Array<Locale>} */ (['en'])
const defaultLocale = /** @type {Locale} */ ('en')

/** @type {NextConfig} */
const config = {
  eslint: {
    dirs: [process.cwd()],
    ignoreDuringBuilds: true,
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

    if (process.env['NEXT_PUBLIC_BOTS'] !== 'enabled') {
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
  typescript: {
    ignoreBuildErrors: true,
  },
}

/** @type {Array<(config: NextConfig) => NextConfig>} */
const plugins = [
  createBundleAnalyzerPlugin({ enabled: process.env['BUNDLE_ANALYZER'] === 'enabled' }),
]

export default plugins.reduce((config, plugin) => {
  return plugin(config)
}, config)
