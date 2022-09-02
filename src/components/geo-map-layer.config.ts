import type { LayerProps as LayerPropsWithoutId } from 'react-map-gl'

type LayerProps = Required<LayerPropsWithoutId, 'id'>

export const clusterLayer: LayerProps = {
  id: 'clusters',
  type: 'circle',
  source: 'places-data',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 15, '#f1f075', 50, '#f28cb1'],
    'circle-radius': ['step', ['get', 'point_count'], 20, 15, 30, 50, 40],
  },
}

export const clusterCountLayer: LayerProps = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'places-data',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-size': 12,
  },
}

export const unclusteredPointLayer: LayerProps = {
  id: 'unclustered-point',
  type: 'circle',
  source: 'places-data',
  filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'visibility'], true]],
  paint: {
    'circle-color': [
      'match',
      ['get', 'profession'],
      'historian (Q201788)',
      'red',
      'writer (Q36180)',
      'yellow',
      'journalist (Q1930187)',
      'green',
      'blue',
    ],
    'circle-radius': 8,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff',
  },
}

export const lineStyle: LayerProps = {
  id: 'lines',
  type: 'line',
  source: 'lines-data',
  paint: {
    'line-width': [
      'match',
      ['get', 'type'],
      'friendship with',
      3,
      'close friendship with',
      4,
      'married',
      5,
      'married to',
      5,
      2,
    ],
    'line-color': [
      'match',
      ['get', 'type'],
      'friendship with',
      'red',
      'close friendship with',
      'yellow',
      'married',
      'green',
      'married to',
      'green',
      'blue',
    ],
  },
  filter: ['==', ['get', 'visibility'], true],
}
