import type { FeatureCollection } from 'geojson'
import { useEffect } from 'react'
import { Layer, Source, useMap } from 'react-map-gl'

import {
  clusterCountLayer,
  clusterLayer,
  lineStyle,
  unclusteredPointLayer,
} from '@/components/geo-map-layer.config'
import { usePopoverState } from '@/components/Popover'

interface LayerProps {
  id: { source: string; layer: string }
  data: FeatureCollection
  linesData: FeatureCollection
  generatePopupContent: (event: any) => void
}

export function LayerCollection(props: LayerProps): JSX.Element {
  const { id, generatePopupContent } = props

  const popover = usePopoverState()

  const { current: map } = useMap()

  useEffect(() => {
    if (map == null) return

    const { hide } = popover

    map.on('click', 'unclustered-point', (event) => {
      generatePopupContent(event)
    })
    map.on('click', 'spider-leaves', (event) => {
      generatePopupContent(event)
    })
    map.on('click', 'clusters', (event) => {
      event.preventDefault()
    })

    map.on('click', 'lines', (event) => {
      generatePopupContent(event)
    })

    map.on('zoom', () => {
      hide()
    })

    map.on('mouseenter', id.layer, () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', id.layer, () => {
      map.getCanvas().style.cursor = ''
    })
  }, [map, id.layer, popover, generatePopupContent])

  return (
    <>
      <Source id="lines-data" type="geojson" data={props.linesData}>
        <Layer {...lineStyle} />
      </Source>
      <Source
        id={'places-data'}
        type="geojson"
        data={props.data}
        cluster={true}
        clusterMaxZoom={25}
        clusterRadius={15}
      >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPointLayer} />
      </Source>
    </>
  )
}
