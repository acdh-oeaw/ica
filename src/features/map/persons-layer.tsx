import { assert } from '@stefanprobst/assert'
import type { Feature, FeatureCollection, Point } from 'geojson'
import { Fragment, useMemo } from 'react'
import type { CircleLayer } from 'react-map-gl'
import { Layer, Source } from 'react-map-gl'

import { db } from '@/db'
import type { Place, Relation } from '@/db/types'
import type { Filters } from '@/features/map/use-filters'

const colors: Record<Status, string> = {
  selected: '#1b1e28',
  related: '#69c0ef',
}

export const personsLayerStyle: CircleLayer = {
  id: 'persons',
  type: 'circle',
  paint: {
    'circle-radius': 6,
    /**
     * For the mapbox-gl expression language @see https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions
     */
    'circle-color': [
      'case',
      ['==', ['get', 'status'], 'selected'],
      colors.selected,
      colors.related,
    ],
  },
}

export interface PlaceContentSets {
  persons: Set<Relation['id']>
  institutions: Set<Relation['id']>
  events: Set<Relation['id']>
}

export interface PlaceContentArrays {
  persons: Array<Relation['id']>
  institutions: Array<Relation['id']>
  events: Array<Relation['id']>
}

type Status = 'related' | 'selected'

export type PlaceFeature = Feature<
  Point,
  Pick<Place, 'id' | 'kind'> & {
    status: Status
    content: PlaceContentArrays
  }
>

interface PersonsLayerProps {
  filters: Filters
}

export function PersonsLayer(props: PersonsLayerProps): JSX.Element {
  const { filters } = props

  const [places, relatedPlaces] = useMemo(() => {
    /**
     * Places directly related to selected persons.
     */
    const places = new Map<Place['id'], PlaceContentSets>()
    /**
     * Places indirectly related to selected persons, either via related institutions,
     * persons, or events:
     * - peson => institution => place
     * - person => person => place
     * - person => event => place
     */
    const relatedPlaces = new Map<Place['id'], PlaceContentSets>()

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

    function addPlace(places: Map<Place['id'], PlaceContentSets>, id: Place['id']) {
      if (!places.has(id)) {
        places.set(id, { persons: new Set(), institutions: new Set(), events: new Set() })
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return places.get(id)!
    }

    function isSelectedRelationType(relation: Relation) {
      if (filters.selectedRelationTypes.length === 0) return true
      return filters.selectedRelationTypes.includes(relation.type.id)
    }

    selectedPersons.forEach((person) => {
      /**
       * person => place
       */
      person.places.forEach((relationId) => {
        const relation = db.relations.get(relationId)
        assert(relation != null, 'Relation should exist.')
        if (!isSelectedRelationType(relation)) return

        const target = relation.source.id === person.id ? relation.target : relation.source
        const place = db.places.get(target.id)
        assert(place != null, 'Relation target has unexpected entity kind.')

        addPlace(places, place.id).persons.add(relation.id)
      })

      person.institutions.forEach((relationId) => {
        const relation = db.relations.get(relationId)
        assert(relation != null, 'Relation should exist.')
        if (!isSelectedRelationType(relation)) return

        const target = relation.source.id === person.id ? relation.target : relation.source
        const institution = db.institutions.get(target.id)
        assert(institution != null, 'Relation target has unexpected entity kind.')

        /**
         * person => institution => place
         */
        institution.places.forEach((relationId) => {
          const relation = db.relations.get(relationId)
          assert(relation != null, 'Relation should exist.')
          if (!isSelectedRelationType(relation)) return

          const target = relation.source.id === institution.id ? relation.target : relation.source
          const place = db.places.get(target.id)
          assert(place != null, 'Relation target has unexpected entity kind.')

          addPlace(relatedPlaces, place.id).institutions.add(relation.id)
        })
      })

      person.persons.forEach((relationId) => {
        const relation = db.relations.get(relationId)
        assert(relation != null, 'Relation should exist.')
        if (!isSelectedRelationType(relation)) return

        const target = relation.source.id === person.id ? relation.target : relation.source
        const _person = db.persons.get(target.id)
        assert(_person != null, 'Relation target has unexpected entity kind.')

        /**
         * person => person => place
         */
        _person.places.forEach((relationId) => {
          const relation = db.relations.get(relationId)
          assert(relation != null, 'Relation should exist.')
          if (!isSelectedRelationType(relation)) return

          const target = relation.source.id === _person.id ? relation.target : relation.source
          const place = db.places.get(target.id)
          assert(place != null, 'Relation target has unexpected entity kind.')

          addPlace(relatedPlaces, place.id).persons.add(relation.id)
        })
      })

      person.events.forEach((relationId) => {
        const relation = db.relations.get(relationId)
        assert(relation != null, 'Relation should exist.')
        if (!isSelectedRelationType(relation)) return

        const target = relation.source.id === person.id ? relation.target : relation.source
        const event = db.events.get(target.id)
        assert(event != null, 'Relation target has unexpected entity kind.')

        /**
         * person => event => place
         */
        event.places.forEach((relationId) => {
          const relation = db.relations.get(relationId)
          assert(relation != null, 'Relation should exist.')
          if (!isSelectedRelationType(relation)) return

          const target = relation.source.id === event.id ? relation.target : relation.source
          const place = db.places.get(target.id)
          assert(place != null, 'Relation target has unexpected entity kind.')

          addPlace(relatedPlaces, place.id).events.add(relation.id)
        })
      })
    })

    return [places, relatedPlaces]
  }, [filters])

  const geoJson = useMemo(() => {
    const geojson: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    }

    function createFeature(place: Place, content: PlaceContentSets, status: Status): PlaceFeature {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: place.coordinates,
        },
        properties: {
          id: place.id,
          kind: place.kind,
          status,
          /**
           * Note that `mapbox-gl` json-stringifies any feature properties on events.
           *
           * @see https://github.com/mapbox/mapbox-gl-js/issues/2434
           */
          content: {
            events: Array.from(content.events),
            institutions: Array.from(content.institutions),
            persons: Array.from(content.persons),
          },
        },
      }
    }

    places.forEach((content, placeId) => {
      const place = db.places.get(placeId)
      if (place == null) return

      geojson.features.push(createFeature(place, content, 'selected'))
    })

    relatedPlaces.forEach((content, placeId) => {
      if (places.has(placeId)) return

      const place = db.places.get(placeId)
      if (place == null) return

      geojson.features.push(createFeature(place, content, 'related'))
    })

    return geojson
  }, [places, relatedPlaces])

  return (
    <Fragment>
      <Source type="geojson" data={geoJson}>
        <Layer {...personsLayerStyle} />
      </Source>
    </Fragment>
  )
}
