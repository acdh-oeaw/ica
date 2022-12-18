import type { ReactNode } from 'react'
import { Fragment } from 'react'

import { PageFooter } from '@/components/page-footer'
import { PageHeader } from '@/components/page-header'
import { SkipNav } from '@/components/skip-nav'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout(props: PageLayoutProps): JSX.Element {
  const { children } = props

  return (
    <Fragment>
      <SkipNav />

      <div className="grid min-h-full grid-rows-[auto_1fr_auto]">
        <PageHeader />
        {children}
        <PageFooter />
      </div>
    </Fragment>
  )
}
