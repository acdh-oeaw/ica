import { I18nProvider } from '@stefanprobst/next-i18n'
import type { ReactNode } from 'react'
import { I18nProvider as UiI18nProvider, SSRProvider } from 'react-aria'

import type { DictionariesProps } from '@/lib/i18n/dictionaries'
import { useLocale } from '@/lib/route/use-locale'

interface ProvidersProps extends DictionariesProps {
  children: ReactNode
}

export function Providers(props: ProvidersProps): JSX.Element {
  const { children, dictionaries } = props

  const { locale } = useLocale()

  return (
    <SSRProvider>
      <I18nProvider dictionaries={dictionaries}>
        <UiI18nProvider locale={locale}>{children}</UiI18nProvider>
      </I18nProvider>
    </SSRProvider>
  )
}
