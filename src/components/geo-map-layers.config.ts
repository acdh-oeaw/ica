import type { LayerProps } from 'react-map-gl'

const circle: LayerProps = {
  type: 'circle',
  paint: {
    'circle-radius': 5,
    'circle-color': '#00aaaa',
  },
  filter: ['==', ['get', 'visibility'], true],
}

export const layerStyle = {
  circle,
}
