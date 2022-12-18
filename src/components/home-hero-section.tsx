import Link from 'next/link'
import { Fragment } from 'react'

import { useI18n } from '@/lib/i18n/use-i18n'
import { useAppMetadata } from '@/lib/metadata/use-app-metadata'
import * as routes from '@/lib/route/routes'

export function HomeHeroSection(): JSX.Element {
  const { t } = useI18n<'common'>()
  const metadata = useAppMetadata()

  return (
    <Fragment>
      <section className="border-b border-t border-primary-200 bg-primary-50">
        <div className="mx-auto max-w-7xl px-8 py-8">
          <div className="grid justify-items-center gap-4 py-32">
            <h1 className="text-center text-5xl font-extrabold tracking-tighter md:text-6xl lg:text-7xl">
              {metadata.title}
            </h1>
            <h2 className="max-w-2xl text-center text-2xl font-extrabold tracking-tight md:text-3xl">
              {metadata.description}
            </h2>
            <div className="mx-auto mt-4 flex flex-col gap-4 xs:flex-row">
              <Link
                className="inline-flex rounded-md bg-primary-600 px-12 py-4 text-center font-medium text-neutral-0 hover:bg-primary-700 hover:text-neutral-0 focus-visible:bg-primary-700 focus-visible:ring"
                href={routes.geoVisualisation()}
              >
                {t(['common', 'home', 'explore-map'])}
              </Link>
              <Link
                className="inline-flex rounded-md bg-primary-600 px-12 py-4 text-center font-medium text-neutral-0 hover:bg-primary-700 hover:text-neutral-0 focus-visible:bg-primary-700 focus-visible:ring"
                href={routes.networkVisualisation()}
              >
                {t(['common', 'home', 'explore-graph'])}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-7xl px-8 py-8">
          <div
            className="mx-auto grid max-w-xl items-start gap-4 font-medium leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t(['common', 'home', 'intro']) }}
          />
        </div>
      </section>
    </Fragment>
  )
}
