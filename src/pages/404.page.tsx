import { PageMetadata } from '@stefanprobst/next-page-metadata'
import { Fragment } from 'react'

import { MainContent } from '@/components/main-content'
import { useI18n } from '@/lib/i18n/use-i18n'
import { withDictionaries } from '@/lib/i18n/with-dictionaries'
import { usePageTitleTemplate } from '@/lib/metadata/use-page-title-template'

export const getStaticProps = withDictionaries(['common'])

export default function NotFoundErrorPage(): JSX.Element {
  const { t } = useI18n<'common'>()
  const titleTemplate = usePageTitleTemplate()

  const metadata = { title: t(['common', 'pages', '404', 'metadata', 'title']) }

  return (
    <Fragment>
      <PageMetadata nofollow noindex title={metadata.title} titleTemplate={titleTemplate} />
      <MainContent>
        <h1>{metadata.title}</h1>
      </MainContent>
    </Fragment>
  )
}
