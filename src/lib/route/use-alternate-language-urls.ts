import type { UrlSearchParamsInit } from '@stefanprobst/request'
import { useMemo } from 'react'

import { createAppUrl } from '@/lib/create-app-url'
import { useLocale } from '@/lib/route/use-locale'
import { usePathname } from '@/lib/route/use-pathname'
import type { Locale } from '~/config/i18n.config'

export type UseAlternateLanguageUrlsResult = Array<{ hrefLang: Locale; href: string }>

export function useAlternateLanguageUrls(
  searchParams?: UrlSearchParamsInit,
): UseAlternateLanguageUrlsResult {
  const { locales } = useLocale()
  const { pathname } = usePathname()

  const urls = useMemo(() => {
    return locales.map((locale) => {
      const url = createAppUrl({
        locale,
        pathname,
        searchParams,
        hash: undefined,
      })

      return { hrefLang: locale, href: String(url) }
    })
  }, [locales, pathname, searchParams])

  return urls
}
