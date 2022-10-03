import Link from 'next/link'
import { Fragment } from 'react'

import { useI18n } from '@/app/i18n/use-i18n'
import { useAppMetadata } from '@/app/metadata/use-app-metadata'
import * as routes from '@/app/route/routes'

export function HomeHeroSection(): JSX.Element {
  const { t } = useI18n<'common'>()
  const metadata = useAppMetadata()

  return (
    <Fragment>
      <section className="border-b border-t border-neutral-200 bg-neutral-100">
        <div className="mx-auto max-w-7xl px-8 py-8">
          <div className="grid gap-4 py-32">
            <h1 className="text-6xl font-extrabold tracking-tighter">{metadata.title}</h1>
            <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight">
              {metadata.description}
            </h2>
            <div className="mt-4">
              <Link
                className="inline-flex rounded-md bg-neutral-900 px-12 py-4 font-medium text-neutral-50 hover:bg-neutral-800 hover:text-neutral-0"
                href={routes.visualisation()}
              >
                {t(['common', 'home', 'explore-map'])}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-7xl px-8 py-8">
          <div
            className="grid max-w-xl gap-4 font-medium leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t(['common', 'home', 'intro']) }}
          />
        </div>
      </section>
    </Fragment>
  )
}
