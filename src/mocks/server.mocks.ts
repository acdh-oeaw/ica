import { setupServer } from 'msw/node'

import { handlers } from '@/mocks/handlers.mocks'

export const server = setupServer(...handlers)

export { rest } from 'msw'
