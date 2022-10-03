import type { Feature, FeatureCollection, Point } from 'geojson'
import { Fragment, useMemo } from 'react'
import { CircleLayer, Layer, Source } from 'react-map-gl'

import { db } from '@/db'
import type { Person, Place } from '@/db/types'
import type { Filters } from '@/features/map/use-filters'

export const personsLayerStyle = {
  id: 'persons',
  type: 'circle',
  paint: {
    'circle-radius': 6,
    'circle-color': '#6ee7b7',
  },
} // satisfies CircleLayer

export const relationsLayerStyle = {
  id: 'relations',
  type: 'circle',
  paint: {
    'circle-radius': 6,
    'circle-color': '#fca5a5',
  },
} // satisfies CircleLayer

interface PersonsLayerProps {
  filters: Filters
}

export function PersonsLayer(props: PersonsLayerProps): JSX.Element {
  const { filters } = props

  const [places, relatedPlaces] = useMemo(() => {
    /**
     * Places directly related to selected persons.
     */
    const places = new Set<Place['id']>()
    /**
     * Places indirectly related to selected persons, either via related institutions,
     * or related persons, i.e. peson=>institution=>place or person=>person=>place
     */
    const relatedPlaces = new Set<Place['id']>()

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
      /**
       * person => place
       */
      person.places.forEach((placeId) => {
        places.add(placeId)
      })

      person.institutions.forEach((institutionId) => {
        const institution = db.institutions.get(institutionId)

        /**
         * peson => institution => place
         */
        institution?.places.forEach((placeId) => {
          relatedPlaces.add(placeId)
        })
        // /**
        //  * person => institution => person => place
        //  */
        // institution?.persons.forEach((personId) => {
        //   const person = db.persons.get(personId)
        //   person?.places.forEach((placeId) => {
        //     relatedPlaces.add(placeId)
        //   })
        // })
      })

      person.persons.forEach((personId) => {
        const person = db.persons.get(personId)

        /**
         * person => person => place
         */
        person?.places.forEach((placeId) => {
          relatedPlaces.add(placeId)
        })

        /**
         * person => person => institution => place
         */
        // person?.institutions.forEach((institutionId) => {
        //   const institution = db.institutions.get(institutionId)
        //   institution?.places.forEach((placeId) => {
        //     relatedPlaces.add(placeId)
        //   })
        // })
      })
    })

    return [places, relatedPlaces]
  }, [filters])

  const placesGeoJson = useMemo(() => {
    const geojson: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    }

    places.forEach((placeId) => {
      const place = db.places.get(placeId)
      if (place == null) return

      const feature: Feature<Point> = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: place.coordinates,
        },
        properties: {
          id: place.id,
          kind: place.kind,
        },
      }

      geojson.features.push(feature)
    })

    return geojson
  }, [places])

  const relatedPlacesGeoJson = useMemo(() => {
    const geojson: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    }

    relatedPlaces.forEach((placeId) => {
      if (places.has(placeId)) return

      const place = db.places.get(placeId)
      if (place == null) return

      const feature: Feature<Point> = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: place.coordinates,
        },
        properties: {
          id: place.id,
          kind: place.kind,
        },
      }

      geojson.features.push(feature)
    })

    return geojson
  }, [places, relatedPlaces])

  return (
    <Fragment>
      <Source type="geojson" data={relatedPlacesGeoJson}>
        <Layer {...relationsLayerStyle} />
      </Source>
      <Source type="geojson" data={placesGeoJson}>
        <Layer {...personsLayerStyle} />
      </Source>
    </Fragment>
  )
}
