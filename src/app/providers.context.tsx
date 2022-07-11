import { I18nProvider } from '@stefanprobst/next-i18n'
import { HttpError } from '@stefanprobst/request'
import type { ReactNode } from 'react'
import type { SWRConfiguration } from 'swr'
import { SWRConfig } from 'swr'

import type { DictionariesProps } from '@/app/i18n/dictionaries'
import { notify } from '@/app/notifications/notify'

interface ProvidersProps extends DictionariesProps {
  children: ReactNode
}

export function Providers(props: ProvidersProps): JSX.Element {
  const { children, dictionaries } = props

  return (
    <I18nProvider dictionaries={dictionaries}>
      <SWRConfig value={swrConfig}>{children}</SWRConfig>
    </I18nProvider>
  )
}

const swrConfig: SWRConfiguration = {
  onError(error) {
    const message = error instanceof HttpError ? error.response.statusText : String(error)
    notify.error(message)
  },
}
