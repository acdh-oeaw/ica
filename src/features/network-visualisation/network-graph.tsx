import { assert } from '@stefanprobst/assert'
import type { ForceGraphInstance } from 'force-graph'
import { useEffect, useMemo, useState } from 'react'

import { db } from '@/db'
import type { EntityBase, EntityKind, Relation, RelationBase } from '@/db/types'
import type { NetworkGraphFilters } from '@/features/network-visualisation/use-network-graph-filters'
import { useElementDimensions } from '@/lib/use-element-dimensions'
import { useElementRef } from '@/lib/use-element-ref'
import { useEvent } from '@/lib/use-event'

interface NetworkGraphProps {
  filters: NetworkGraphFilters
  onNodeClick: (node: GraphNode | null) => void
}

type GraphNodeKey = `${EntityKind}__${EntityBase['id']}`

type GraphNode = EntityBase & { key: GraphNodeKey }

export function NetworkGraph(props: NetworkGraphProps): JSX.Element {
  const { filters, onNodeClick } = props

  const [element, setElement] = useElementRef<HTMLElement>()
  const [forceGraph, setForceGraph] = useState<{ instance: ForceGraphInstance } | null>(null)
  const dimensions = useElementDimensions({ element })

  useEffect(() => {
    let isCanceled = false
    let instance: ForceGraphInstance | null = null

    async function init() {
      /**
       * Using dynamic import for `force-graph` only because of issues with d3 esm-only packaging.
       */
      const forceGraph = await import('force-graph').then((mod) => {
        return mod.default
      })

      if (!isCanceled) {
        instance = forceGraph()

        instance.nodeId('key')
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
          return '#dfdfdf'
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

  const _onNodeClick = useEvent(onNodeClick)
  useEffect(() => {
    forceGraph?.instance.onNodeClick((node) => {
      _onNodeClick(node as GraphNode)
    })
    forceGraph?.instance.onBackgroundClick(() => {
      _onNodeClick(null)
    })
  }, [forceGraph, _onNodeClick])

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
    function createKey(entity: EntityBase) {
      return [entity.kind, entity.id].join('__') as GraphNodeKey
    }

    const nodes = new Map<GraphNode['key'], GraphNode>()
    const edges = new Map<
      RelationBase['id'],
      { source: GraphNode['key']; target: GraphNode['key'] }
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

    function isSelectedRelationType(relation: Relation) {
      if (filters.selectedRelationTypes.length === 0) return true
      return filters.selectedRelationTypes.includes(relation.type.id)
    }

    const [minYear, maxYear] = filters.selectedDateRange

    function isSelectedDateRange(relation: Relation) {
      // FIXME: clarify behavior, especially for null date fields
      // @see https://github.com/acdh-oeaw/ica/issues/24
      if (relation.startDate != null) {
        const startYear = new Date(relation.startDate).getUTCFullYear()
        if (startYear < minYear) return false
      }
      if (relation.endDate != null) {
        const endYear = new Date(relation.endDate).getUTCFullYear()
        if (endYear > maxYear) return false
      }
      return true
    }

    selectedPersons.forEach((person) => {
      const personKey = createKey(person)
      // FIXME: should we only add a person node when it is actually part of a relation?
      // @see https://github.com/acdh-oeaw/ica/issues/25
      nodes.set(personKey, {
        key: personKey,
        kind: person.kind,
        id: person.id,
        label: person.label,
      })

      person.persons.forEach((relationId) => {
        const relation = db.relations.get(relationId)
        assert(relation != null, 'Relation should exist.')
        if (!isSelectedRelationType(relation)) return
        if (!isSelectedDateRange(relation)) return

        const target = relation.source.id === person.id ? relation.target : relation.source
        const targetKey = createKey(target)

        nodes.set(targetKey, {
          key: targetKey,
          kind: target.kind,
          id: target.id,
          label: target.label,
        })
        edges.set(relation.id, { source: personKey, target: targetKey })
      })

      person.institutions.forEach((relationId) => {
        const relation = db.relations.get(relationId)
        assert(relation != null, 'Relation should exist.')
        if (!isSelectedRelationType(relation)) return
        if (!isSelectedDateRange(relation)) return

        const target = relation.source.id === person.id ? relation.target : relation.source
        const targetKey = createKey(target)

        nodes.set(targetKey, {
          key: targetKey,
          kind: target.kind,
          id: target.id,
          label: target.label,
        })
        edges.set(relation.id, { source: personKey, target: targetKey })
      })

      person.places.forEach((relationId) => {
        const relation = db.relations.get(relationId)
        assert(relation != null, 'Relation should exist.')
        if (!isSelectedRelationType(relation)) return
        if (!isSelectedDateRange(relation)) return

        const target = relation.source.id === person.id ? relation.target : relation.source
        const targetKey = createKey(target)

        nodes.set(targetKey, {
          key: targetKey,
          kind: target.kind,
          id: target.id,
          label: target.label,
        })
        edges.set(relation.id, { source: personKey, target: targetKey })
      })

      person.events.forEach((relationId) => {
        const relation = db.relations.get(relationId)
        assert(relation != null, 'Relation should exist.')
        if (!isSelectedRelationType(relation)) return
        if (!isSelectedDateRange(relation)) return

        const target = relation.source.id === person.id ? relation.target : relation.source
        const targetKey = createKey(target)

        nodes.set(targetKey, {
          key: targetKey,
          kind: target.kind,
          id: target.id,
          label: target.label,
        })
        edges.set(relation.id, { source: personKey, target: targetKey })
      })
    })

    return { nodes: Array.from(nodes.values()), links: Array.from(edges.values()) }
  }, [filters])

  useEffect(() => {
    forceGraph?.instance.graphData(graphData)
  }, [forceGraph, graphData])

  return <div ref={setElement} />
}

declare module 'force-graph' {
  interface NodeObject extends Omit<GraphNode, 'id'> {}
}
