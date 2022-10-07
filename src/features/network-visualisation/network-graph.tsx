import type { ForceGraphInstance } from 'force-graph'
import { useEffect, useMemo, useState } from 'react'

import { db } from '@/db'
import type { EntityBase, RelationBase } from '@/db/types'
import type { NetworkGraphFilters } from '@/features/network-visualisation/use-network-graph-filters'
import { useElementDimensions } from '@/lib/use-element-dimensions'
import { useElementRef } from '@/lib/use-element-ref'

interface NetworkGraphProps {
  filters: NetworkGraphFilters
}

export function NetworkGraph(props: NetworkGraphProps): JSX.Element {
  const { filters } = props

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

        instance.nodeLabel((node) => {
          return node.label
        })
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

        instance.linkColor(() => {
          return '#eee'
        })

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

    let selectedPersons =
      filters.selectedPersons.length === 0
        ? Array.from(db.persons.values())
        : filters.selectedPersons.map((personId) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return db.persons.get(personId)!
          })

    if (filters.selectedProfessions.length > 0) {
      selectedPersons = selectedPersons.filter((person) => {
        return filters.selectedProfessions.some((professionId) => {
          return person.professions.has(professionId)
        })
      })
    }

    selectedPersons.forEach((person) => {
      nodes.add({ kind: person.kind, id: person.id, label: person.label })

      person.persons.forEach((relationId) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const relation = db.relations.get(relationId)!
        const target = relation.target
        nodes.add({ kind: target.kind, id: target.id, label: target.label })
        edges.set(relation.id, { source: person.id, target: target.id })
      })

      person.institutions.forEach((relationId) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const relation = db.relations.get(relationId)!
        const target = relation.target
        nodes.add({ kind: target.kind, id: target.id, label: target.label })
        edges.set(relation.id, { source: person.id, target: target.id })
      })

      person.places.forEach((relationId) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const relation = db.relations.get(relationId)!
        const target = relation.target
        nodes.add({ kind: target.kind, id: target.id, label: target.label })
        edges.set(relation.id, { source: person.id, target: target.id })
      })

      person.events.forEach((relationId) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const relation = db.relations.get(relationId)!
        const target = relation.target
        nodes.add({ kind: target.kind, id: target.id, label: target.label })
        edges.set(relation.id, { source: person.id, target: target.id })
      })
    })

    return { nodes: Array.from(nodes), links: Array.from(edges.values()) }
  }, [filters])

  useEffect(() => {
    forceGraph?.instance.graphData(graphData)
  }, [forceGraph, graphData])

  return <div ref={setElement} />
}

declare module 'force-graph' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface NodeObject extends EntityBase {}
}
