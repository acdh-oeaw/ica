import '@fontsource/inter/variable-full.css'
import 'tailwindcss/tailwind.css'
import '@/styles/index.css'
import '@/styles/nprogress.css'
import '~/stories/preview.css'

import { action } from '@storybook/addon-actions'
import type { DecoratorFn, Parameters } from '@storybook/react'
import {
  initialize as initializeMockServiceWorker,
  mswDecorator as withMockServiceWorker,
} from 'msw-storybook-addon'
import { RouterContext } from 'next/dist/shared/lib/router-context'
import type { NextRouter } from 'next/router'
import { Fragment } from 'react'

import { dictionary as common } from '@/app/i18n/common/en'
import type { Dictionaries } from '@/app/i18n/dictionaries'
import { Providers } from '@/app/providers.context'
import { createMockRouter } from '@/mocks/create-mock-router'

initializeMockServiceWorker({ onUnhandledRequest: 'bypass' })

const withNotifications: DecoratorFn = function withNotifications(story, context) {
  return <Fragment>{story(context)}</Fragment>
}

const withProviders: DecoratorFn = function withProviders(story, context) {
  const partialDictionaries = context.parameters['dictionaries'] as Partial<Dictionaries>
  const dictionaries = { common, ...partialDictionaries }

  return <Providers dictionaries={dictionaries}>{story(context)}</Providers>
}

const withRouter: DecoratorFn = function withRouter(story, context) {
  const partialRouter = context.parameters['router'] as Partial<NextRouter>
  const mockRouter = createMockRouter({
    // @ts-expect-error Should return `Promise`.
    push: action('router.push'),
    // @ts-expect-error Should return `Promise`.
    replace: action('router.replace'),
    ...partialRouter,
  })

  return <RouterContext.Provider value={mockRouter}>{story(context)}</RouterContext.Provider>
}

export const decorators: Array<DecoratorFn> = [
  withNotifications,
  withProviders,
  withRouter,
  withMockServiceWorker as DecoratorFn,
]

export const parameters: Parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
