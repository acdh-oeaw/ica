import { groupByToMap } from '@stefanprobst/group-by'
import { keyByToMap } from '@stefanprobst/key-by'
import { useMemo } from 'react'

import { useInstitutionPlaceRelations, useInstitutions, usePlaces } from '@/api/ica.client'

// FIXME:
/* eslint-disable @typescript-eslint/no-unused-vars */

export function useInstitutionPlaces() {
  const institutionsQuery = useInstitutions({})
  const [institutionIds, institutions, institutionsById] = useMemo(() => {
    const institutionsById = keyByToMap(institutionsQuery.data?.results ?? [], (institution) => {
      return institution.id
    })
    const institutionIds = Array.from(institutionsById.keys())
    const institutions = Array.from(institutionsById.values())
    return [institutionIds, institutions, institutionsById]
  }, [institutionsQuery.data])

  const institutionPlaceRelationsQuery = useInstitutionPlaceRelations(
    { ids: institutionIds },
    { disabled: institutionIds.length === 0 },
  )
  const [relatedPlaceIds, relationsByPlaceInst] = useMemo(() => {
    const relationsByPlaceInst = groupByToMap(
      institutionPlaceRelationsQuery.data?.results ?? [],
      (relation) => {
        return relation.related_place.id
      },
    )
    const relatedPlaceIds = Array.from(relationsByPlaceInst.keys())
    return [relatedPlaceIds, relationsByPlaceInst]
  }, [institutionPlaceRelationsQuery.data])
  const [relatedInstitutionIds, relationsByInstitution] = useMemo(() => {
    const relationsByInstitution = groupByToMap(
      institutionPlaceRelationsQuery.data?.results ?? [],
      (relation) => {
        return relation.related_institution.id
      },
    )
    const relatedInstitutionIds = Array.from(relationsByInstitution.keys())
    return [relatedInstitutionIds, relationsByInstitution]
  }, [institutionPlaceRelationsQuery.data])

  const placesQuery = usePlaces(
    { ids: relatedPlaceIds },
    { disabled: relatedPlaceIds.length === 0 },
  )
  const [placeIds, places, placesById] = useMemo(() => {
    const placesById = keyByToMap(placesQuery.data?.results ?? [], (place) => {
      return place.id
    })
    const placeIds = Array.from(placesById.keys())
    const places = Array.from(placesById.values())
    return [placeIds, places, placesById]
  }, [placesQuery.data])

  return {
    institutions,
    places,
    relationsByInstitution,
    relationsByPlaceInst,
  }
}
