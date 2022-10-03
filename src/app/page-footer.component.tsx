import Link from 'next/link'

import { useI18n } from '@/app/i18n/use-i18n'
import { useAppMetadata } from '@/app/metadata/use-app-metadata'
import * as routes from '@/app/route/routes'

export function PageFooter(): JSX.Element {
  const { t } = useI18n<'common'>()
  const appMetadata = useAppMetadata()

  return (
    <footer>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4 text-xs font-medium">
        <span>
          &copy; {new Date().getUTCFullYear()}{' '}
          <a href={appMetadata.creator.website} rel="noreferrer" target="_blank">
            {appMetadata.creator.shortName ?? appMetadata.creator.name}
          </a>
        </span>
        <Link href={routes.imprint()}>
          {t(['common', 'pages', 'imprint', 'metadata', 'title'])}
        </Link>
      </div>
    </footer>
  )
}
