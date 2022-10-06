import { RouterContext } from 'next/dist/shared/lib/router-context'
import type { NextRouter } from 'next/router'
import type { FC } from 'react'

import { dictionary as common } from '@/app/i18n/common/en'
import type { Dictionaries } from '@/app/i18n/dictionaries'
import { Providers } from '@/app/providers.context'
import { createMockRouter } from '@/mocks/create-mock-router'

interface WrapperProps {
  children: JSX.Element
}

export interface CreateWrapperArgs {
  dictionaries?: Partial<Dictionaries>
  router?: Partial<NextRouter>
}

export function createWrapper(args: CreateWrapperArgs): FC<WrapperProps> {
  const { dictionaries = { common }, router } = args

  const mockRouter = createMockRouter(router)

  function Wrapper(props: WrapperProps): JSX.Element {
    const { children } = props

    return (
      <RouterContext.Provider value={mockRouter}>
        <Providers dictionaries={dictionaries}>{children}</Providers>
      </RouterContext.Provider>
    )
  }

  return Wrapper
}
