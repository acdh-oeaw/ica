import { PageMetadata } from '@stefanprobst/next-page-metadata'
import type { ForceGraphInstance } from 'force-graph'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'

import { useI18n } from '@/app/i18n/use-i18n'
import { withDictionaries } from '@/app/i18n/with-dictionaries'
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template'
import { MainContent } from '@/components/main-content'
import { db } from '@/db'
import type { EntityBase, RelationBase } from '@/db/types'
import { useElementDimensions } from '@/lib/use-element-dimensions'
import { useElementRef } from '@/lib/use-element-ref'

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
  const [element, setElement] = useElementRef<HTMLElement>()
  const [forceGraph, setForceGraph] = useState<{ instance: ForceGraphInstance } | null>(null)
  const dimensions = useElementDimensions({ element })

  /**
   * Using dynamic import for `force-graph` only because of issues with d3 esm-only packaging.
   */
  useEffect(() => {
    let isCanceled = false
    let instance: ForceGraphInstance | null = null

    async function init() {
      const forceGraph = await import('force-graph').then((mod) => {
        return mod.default
      })

      if (!isCanceled) {
        instance = forceGraph()

        instance.nodeLabel((node) => node.label)
        instance.nodeColor((node) => {
          switch (node.kind) {
            case 'event':
              return 'tomato'
            case 'institution':
              return 'dodgerblue'
            case 'person':
              return '#1b1e28'
            case 'place':
              return 'orange'
            case 'work':
              return 'forestgreen'
          }
        })
        instance.linkColor(() => '#eee')

        setForceGraph({ instance })
      }
    }

    void init()

    return () => {
      isCanceled = true
      instance?._destructor()
    }
  }, [])

  useEffect(() => {
    if (element == null) return

    forceGraph?.instance(element)
  }, [element, forceGraph])

  useEffect(() => {
    if (dimensions == null) return

    forceGraph?.instance.height(dimensions.height)
    forceGraph?.instance.width(dimensions.width)
  }, [dimensions, forceGraph])

  const graphData = useMemo(() => {
    const nodes = new Set<EntityBase>()
    const edges = new Map<
      RelationBase['id'],
      { source: EntityBase['id']; target: EntityBase['id'] }
    >()

    db.persons.forEach((person) => {
      nodes.add({ kind: person.kind, id: person.id, label: person.label })

      person.persons.forEach((relationId) => {
        const relation = db.relations.get(relationId)!
        const target = relation.target
        nodes.add({ kind: target.kind, id: target.id, label: target.label })
        edges.set(relation.id, { source: person.id, target: target.id })
      })

      person.institutions.forEach((relationId) => {
        const relation = db.relations.get(relationId)!
        const target = relation.target
        nodes.add({ kind: target.kind, id: target.id, label: target.label })
        edges.set(relation.id, { source: person.id, target: target.id })
      })

      person.places.forEach((relationId) => {
        const relation = db.relations.get(relationId)!
        const target = relation.target
        nodes.add({ kind: target.kind, id: target.id, label: target.label })
        edges.set(relation.id, { source: person.id, target: target.id })
      })

      person.events.forEach((relationId) => {
        const relation = db.relations.get(relationId)!
        const target = relation.target
        nodes.add({ kind: target.kind, id: target.id, label: target.label })
        edges.set(relation.id, { source: person.id, target: target.id })
      })
    })

    return { nodes: Array.from(nodes), links: Array.from(edges.values()) }
  }, [])

  useEffect(() => {
    forceGraph?.instance.graphData(graphData)
  }, [forceGraph, graphData])

  return <div ref={setElement} />
}

declare module 'force-graph' {
  interface NodeObject extends EntityBase {}
}
