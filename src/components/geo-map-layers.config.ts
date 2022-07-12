import type { LayerProps } from 'react-map-gl'

const circle: LayerProps = {
  type: 'circle',
  paint: {
    'circle-radius': 5,
    'circle-color': '#00aaaa',
  },
}

export const layerStyle = {
  circle,
}
