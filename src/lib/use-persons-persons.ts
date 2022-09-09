import { groupByToMap } from '@stefanprobst/group-by'
import { keyByToMap } from '@stefanprobst/key-by'
import { useMemo } from 'react'

import { usePersons, useSourcePersonRelations, useTargetPersonRelations } from '@/api/ica.client'
import { collection } from '~/config/ica.config'

export function usePersonsPersons() {
  const personsQuery = usePersons({ collection })

  const [personIds, persons, _personsById] = useMemo(() => {
    const personsById = keyByToMap(personsQuery.data?.results ?? [], (person) => {
      return person.id
    })
    const personIds = Array.from(personsById.keys())
    const persons = Array.from(personsById.values())

    return [personIds, persons, personsById]
  }, [personsQuery.data])

  const sourcePersonRelationsQuery = useSourcePersonRelations(
    { ids: personIds },
    { disabled: personIds.length === 0 },
  )
  const targetPersonRelationsQuery = useTargetPersonRelations(
    { ids: personIds },
    { disabled: personIds.length === 0 },
  )

  const personPersonRelationsBySourcePersonId = useMemo(() => {
    const personPersonRelationsBySourcePersonId = groupByToMap(
      sourcePersonRelationsQuery.data?.results ?? [],
      (relation) => {
        if (personIds.includes(relation.related_personB.id)) {
          return relation.related_personA.id
        }
        // we only care about relations to persons in the "webclient" collection
        return 'ignored'
      },
    )
    personPersonRelationsBySourcePersonId.delete('ignored')
    return personPersonRelationsBySourcePersonId
  }, [sourcePersonRelationsQuery.data, personIds])
  const personPersonRelationsByTargetPersonId = useMemo(() => {
    const personPersonRelationsByTargetPersonId = groupByToMap(
      targetPersonRelationsQuery.data?.results ?? [],
      (relation) => {
        if (personIds.includes(relation.related_personA.id)) {
          return relation.related_personB.id
        }
        // we only care about relations to persons in the "webclient" collection
        return 'ignored'
      },
    )
    personPersonRelationsByTargetPersonId.delete('ignored')
    return personPersonRelationsByTargetPersonId
  }, [targetPersonRelationsQuery.data, personIds])

  return {
    persons,
    personPersonRelationsBySourcePersonId,
    personPersonRelationsByTargetPersonId,
  }
}
