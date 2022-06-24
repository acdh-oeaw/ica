import { rest, setupWorker } from 'msw'

import { handlers } from '@/mocks/handlers.mocks'

export const worker = setupWorker(...handlers)

export { rest }

window.msw = { rest, worker }

declare global {
  interface Window {
    msw: { rest: typeof rest; worker: typeof worker }
  }
}
