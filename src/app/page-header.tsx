import Link from 'next/link'

import { useI18n } from '@/app/i18n/use-i18n'
import * as routes from '@/app/route/routes'

export function PageHeader(): JSX.Element {
  const { t } = useI18n<'common'>()

  return (
    <header className="border-b border-neutral-200">
      <div className="gep-4 mx-auto flex max-w-7xl items-center justify-between px-8 py-4 text-sm font-medium">
        <div className="flex-shrink-0">
          <Link
            className="hover:text-primary-700 focus-visible:text-primary-700"
            href={routes.home()}
          >
            {t(['common', 'pages', 'home', 'metadata', 'title'])}
          </Link>
        </div>
        <nav>
          <ul className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2" role="list">
            <li>
              <Link
                className="hover:text-primary-700 focus-visible:text-primary-700"
                href={routes.geoVisualisation()}
              >
                {t(['common', 'pages', 'geo-visualisation', 'metadata', 'title'])}
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-primary-700 focus-visible:text-primary-700"
                href={routes.networkVisualisation()}
              >
                {t(['common', 'pages', 'network-visualisation', 'metadata', 'title'])}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
