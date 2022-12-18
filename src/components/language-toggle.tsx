import Link from 'next/link'

import { useI18n } from '@/lib/i18n/use-i18n'
import { useLocale } from '@/lib/route/use-locale'
import { usePathname } from '@/lib/route/use-pathname'
import { useSearchParams } from '@/lib/route/use-search-params'
import { useUrlFragment } from '@/lib/route/use-url-fragment'

export function LanguageToggle(): JSX.Element {
  const { locale } = useLocale()
  const { pathname } = usePathname()
  const { searchParams } = useSearchParams()
  const { hash } = useUrlFragment()
  const { t } = useI18n<'common'>()

  const language = locale

  return (
    <Link
      aria-label={t(['common', 'app', 'change-language-to'], {
        values: { language: t(['common', 'language', language]) },
      })}
      /** To avoid hydration errors we only add search params and hash clientside. */
      href={{ pathname, query: String(searchParams), hash }}
      locale={language}
    >
      {locale.toUpperCase()}
    </Link>
  )
}
