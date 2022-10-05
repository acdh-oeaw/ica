import Link from 'next/link'

import { useI18n } from '@/app/i18n/use-i18n'
import * as routes from '@/app/route/routes'

export function PageHeader(): JSX.Element {
  const { t } = useI18n<'common'>()

  return (
    <header>
      <div className="gep-4 mx-auto flex max-w-7xl items-center justify-between px-8 py-4 text-sm font-medium">
        <div>
          <Link href={routes.home()}>{t(['common', 'pages', 'home', 'metadata', 'title'])}</Link>
        </div>
        <nav>
          <ul className="flex items-center justify-end gap-4" role="list">
            <li>
              <Link href={routes.geoVisualisation()}>
                {t(['common', 'pages', 'geo-visualisation', 'metadata', 'title'])}
              </Link>
            </li>
            {/* <li>
              <Link href={routes.networkVisualisation()}>
                {t(['common', 'pages', 'network-visualisation', 'metadata', 'title'])}
              </Link>
            </li> */}
          </ul>
        </nav>
      </div>
    </header>
  )
}
