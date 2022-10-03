import Link from 'next/link'

import { useI18n } from '@/app/i18n/use-i18n'
import * as routes from '@/app/route/routes'

export function PageHeader(): JSX.Element {
  const { t } = useI18n<'common'>()

  return (
    <header>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4 text-sm font-medium">
        <div>
          <Link href={routes.home()}>{t(['common', 'pages', 'home', 'metadata', 'title'])}</Link>
        </div>
        <nav>
          <ul>
            <li>
              <Link href={routes.visualisation()}>
                {t(['common', 'pages', 'visualisation', 'metadata', 'title'])}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
