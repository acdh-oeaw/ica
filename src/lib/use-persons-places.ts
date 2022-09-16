import { groupByToMap } from '@stefanprobst/group-by'
import { keyByToMap } from '@stefanprobst/key-by'
import { useMemo } from 'react'

import { usePersonPlaceRelations, usePersons, usePlaces } from '@/api/ica.client'
import { collection } from '~/config/ica.config'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function usePersonsPlaces() {
  const personsQuery = usePersons({ collection })
  const [personIds, persons, _personsById] = useMemo(() => {
    const personsById = keyByToMap(personsQuery.data?.results ?? [], (person) => {
      return person.id
    })
    const personIds = Array.from(personsById.keys())
    const persons = Array.from(personsById.values())
    return [personIds, persons, personsById]
  }, [personsQuery.data])

  const personPlaceRelationsQuery = usePersonPlaceRelations(
    { ids: personIds },
    { disabled: personIds.length === 0 },
  )
  const [relatedPlaceIds, relationsByPlace] = useMemo(() => {
    const relationsByPlace = groupByToMap(
      personPlaceRelationsQuery.data?.results ?? [],
      (relation) => {
        return relation.related_place.id
      },
    )
    const relatedPlaceIds = Array.from(relationsByPlace.keys())
    return [relatedPlaceIds, relationsByPlace]
  }, [personPlaceRelationsQuery.data])
  const [_relatedPersonIds, relationsByPerson] = useMemo(() => {
    const relationsByPerson = groupByToMap(
      personPlaceRelationsQuery.data?.results ?? [],
      (relation) => {
        return relation.related_person.id
      },
    )
    const relatedPersonIds = Array.from(relationsByPerson.keys())
    return [relatedPersonIds, relationsByPerson]
  }, [personPlaceRelationsQuery.data])

  const placesQuery = usePlaces(
    { ids: relatedPlaceIds },
    { disabled: relatedPlaceIds.length === 0 },
  )
  const [_placeIds, places, _placesById] = useMemo(() => {
    const placesById = keyByToMap(placesQuery.data?.results ?? [], (place) => {
      return place.id
    })
    const placeIds = Array.from(placesById.keys())
    const places = Array.from(placesById.values())
    return [placeIds, places, placesById]
  }, [placesQuery.data])

  return {
    persons,
    places,
    relationsByPerson,
    relationsByPlace,
  }
}
