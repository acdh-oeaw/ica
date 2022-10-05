import { PageMetadata } from '@stefanprobst/next-page-metadata'
import type { ForceGraphInstance } from 'force-graph'
import { Fragment, useEffect, useMemo, useState } from 'react'

import { useI18n } from '@/app/i18n/use-i18n'
import { withDictionaries } from '@/app/i18n/with-dictionaries'
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template'
import { MainContent } from '@/components/main-content'

export const getStaticProps = withDictionaries(['common'])

export default function GeoVisualisationPage(): JSX.Element {
  const { t } = useI18n<'common'>()
  const titleTemplate = usePageTitleTemplate()

  const metadata = { title: t(['common', 'pages', 'network-visualisation', 'metadata', 'title']) }

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <MainContent className="relative grid">
        <NetworkGraph />
      </MainContent>
    </Fragment>
  )
}

function NetworkGraph(): JSX.Element {
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const [forceGraph, setForceGraph] = useState<ForceGraphInstance | null>(null)

  useEffect(() => {
    let isCanceled = false
    let fg: ForceGraphInstance | null = null

    async function init() {
      if (element == null) return

      const ForceGraph = await import('force-graph').then((mod) => {
        return mod.default
      })

      if (!isCanceled) {
        fg = ForceGraph()(element)
        setForceGraph(fg)
      }
    }

    void init()

    return () => {
      isCanceled = true
      fg?._destructor()
    }
  }, [element])

  const graphData = useMemo(() => {
    const graphData = { nodes: [], links: [] }

    return graphData
  }, [])

  useEffect(() => {
    forceGraph?.graphData(graphData)
  }, [forceGraph, graphData])

  return <div ref={setElement} />
}
