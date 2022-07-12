import type { FeatureCollection } from 'geojson'

import { usePersonsPlaces } from '@/lib/use-persons-places'


const { places } = usePersonsPlaces();
const placesWithCoordinates = places.filter((place) => {
  if (place.lat != null && place.lng != null) return true
})

const makeGeoJSON = (data) => {
  return {
    type: 'FeatureCollection',
    features: data.map(feature => {
      return {
        "type": "Feature",
        "properties": {
          "id": feature.id,
          "url": feature.url,
          "name": feature.name
        },
        "geometry": {
          "type": "Point",
          "coordinates": [ feature.lat, feature.lng ]
        }
      }
    })
  }
};

export const geojson1: FeatureCollection = makeGeoJSON(placesWithCoordinates);
