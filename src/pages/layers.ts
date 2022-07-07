export const layerStyle: LayerProps = {
  id: 'places',
  type: 'circle',
  source: 'data',
  paint: {
    'circle-radius': 10,
    'circle-color': ['match', ['get', 'Type'], 'Person', 'red', 'Place', 'green', 'yellow'],
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
      ['get', 'Name'],
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
    'line-width': 5,
  },
}
