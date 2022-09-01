import { groupByToMap } from '@stefanprobst/group-by'
import { keyByToMap } from '@stefanprobst/key-by'
import { useMemo } from 'react'

import { usePersonPersonRelations, usePersons } from '@/api/ica.client'
import { collection } from '~/config/ica.config'

// FIXME:
/* eslint-disable @typescript-eslint/no-unused-vars */

export function usePersonsPersons() {
  const personsAQuery = usePersons({ collection })
  const [personIds, persons, personsById] = useMemo(() => {
    const personsById = keyByToMap(personsAQuery.data?.results ?? [], (person) => {
      return person.id
    })
    const personIds = Array.from(personsById.keys())
    const persons = Array.from(personsById.values())
    return [personIds, persons, personsById]
  }, [personsAQuery.data])

  const personPersonRelationsQuery = usePersonPersonRelations(
    { ids: personIds },
    { disabled: personIds.length === 0 },
  )
  const [relatedPersonAIds, relationsByPersonA] = useMemo(() => {
    const relationsByPersonA = groupByToMap(
      personPersonRelationsQuery.data?.results ?? [],
      (relation) => {
        return relation.related_personA.id
      },
    )
    const relatedPersonAIds = Array.from(relationsByPersonA.keys())
    return [relatedPersonAIds, relationsByPersonA]
  }, [personPersonRelationsQuery.data])
  const [relatedPersonBIds, relationsByPersonB] = useMemo(() => {
    const relationsByPersonB = groupByToMap(
      personPersonRelationsQuery.data?.results ?? [],
      (relation) => {
        return relation.related_personB.id
      },
    )
    const relatedPersonBIds = Array.from(relationsByPersonB.keys())
    return [relatedPersonBIds, relationsByPersonB]
  }, [personPersonRelationsQuery.data])

  const personsBQuery = usePersons(
    { ids: relatedPersonBIds },
    { disabled: relatedPersonBIds.length === 0 },
  )
  const [personBIds, personsB, personsBById] = useMemo(() => {
    const personsById = keyByToMap(personsBQuery.data?.results ?? [], (person) => {
      return person.id
    })
    const personIds = Array.from(personsById.keys())
    const persons = Array.from(personsById.values())
    return [personIds, persons, personsById]
  }, [personsBQuery.data])

  return {
    persons,
    relationsByPersonA,
    relationsByPersonB,
  }
}
