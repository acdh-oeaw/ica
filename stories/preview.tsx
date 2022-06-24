import 'tailwindcss/tailwind.css'
import '@/styles/index.css'
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

import { Notifications } from '@/app/notifications/notifications'
import { createMockRouter } from '@/mocks/create-mock-router'

initializeMockServiceWorker({ onUnhandledRequest: 'bypass' })

const withNotifications: DecoratorFn = function withNotifications(Story, context) {
  return (
    <Fragment>
      <Story {...context} />
      <Notifications />
    </Fragment>
  )
}

const withRouter: DecoratorFn = function withRouter(Story, context) {
  const partial = context.parameters['router'] as Partial<NextRouter>
  const mockRouter = createMockRouter({
    // @ts-expect-error Should return `Promise`.
    push: action('router.push'),
    // @ts-expect-error Should return `Promise`.
    replace: action('router.replace'),
    ...partial,
  })

  return (
    <RouterContext.Provider value={mockRouter}>
      <Story {...context} />
    </RouterContext.Provider>
  )
}

export const decorators: Array<DecoratorFn> = [
  withNotifications,
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
