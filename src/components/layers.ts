import type { LayerProps } from 'react-map-gl'

export const layerStyle: LayerProps = {
  id: 'places',
  type: 'circle',
  source: 'data',
  paint: {
    'circle-radius': 10,
    'circle-color': ['match', ['get', 'type'], 'person', 'red', 'institution', 'green', 'yellow'],
  },
  filter: ['in', 'type', 'person', 'institution'],
}

export const pointStyle: LayerProps = {
  id: 'points',
  type: 'circle',
  source: 'data',
  paint: {
    'circle-radius': 5,
    'circle-color': 'black',
  },
}

export const lineStyle: LayerProps = {
  id: 'relations',
  type: 'line',
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
  paint: {
    'line-color': [
      'match',
      ['get', 'type'],
      'Visited regularly',
      'orange',
      'Friends with',
      'pink',
      'Doctor of',
      'blue',
      'Meeting with',
      'violet',
      'Helped to emigrate',
      'brown',
      'yellow',
    ],
    'line-width': 7,
  },
  filter: [
    'in',
    'type',
    'Visited regularly',
    'Friends with',
    'Child of',
    'Doctor of',
    'Meeting with',
    'Helped to emigrate',
    'Studied at',
  ],
}
