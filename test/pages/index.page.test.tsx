import { render, screen } from '@testing-library/react'

import HomePage from '@/pages/index.page'
import { createWrapper } from '~/test/test-utils'

describe('HomePage', () => {
  it('should display page title', () => {
    const router = { pathname: '/' }
    render(<HomePage />, { wrapper: createWrapper({ router }) })
    expect(screen.getByRole('heading', { name: 'Hello, world!' })).toBeInTheDocument()
  })
})
