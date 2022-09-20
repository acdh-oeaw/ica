import { groupByToMap } from '@stefanprobst/group-by'
import { keyByToMap } from '@stefanprobst/key-by'
import { useMemo } from 'react'

import { useInstitutions, usePersonInstitutionRelations, usePersons } from '@/api/ica.client'
import { collection } from '~/config/ica.config'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function usePersonsInstitutions() {
  const personsQuery = usePersons({ collection })
  const [personIds, persons, _personsById] = useMemo(() => {
    const personsById = keyByToMap(personsQuery.data?.results ?? [], (person) => {
      return person.id
    })
    const personIds = Array.from(personsById.keys())
    const persons = Array.from(personsById.values())
    return [personIds, persons, personsById]
  }, [personsQuery.data])

  const personInstitutionRelationsQuery = usePersonInstitutionRelations(
    { ids: personIds },
    { disabled: personIds.length === 0 },
  )
  const [relatedInstitutionIds, relationsByInstitution_Pers] = useMemo(() => {
    const relationsByInstitution_Pers = groupByToMap(
      personInstitutionRelationsQuery.data?.results ?? [],
      (relation) => {
        return relation.related_institution.id
      },
    )
    const relatedInstitutionIds = Array.from(relationsByInstitution_Pers.keys())
    return [relatedInstitutionIds, relationsByInstitution_Pers]
  }, [personInstitutionRelationsQuery.data])
  const [_relatedPersonIds, relationsByPerson_Inst] = useMemo(() => {
    const relationsByPerson_Inst = groupByToMap(
      personInstitutionRelationsQuery.data?.results ?? [],
      (relation) => {
        return relation.related_person.id
      },
    )
    const relatedPersonIds = Array.from(relationsByPerson_Inst.keys())
    return [relatedPersonIds, relationsByPerson_Inst]
  }, [personInstitutionRelationsQuery.data])

  const institutionsQuery = useInstitutions(
    { ids: relatedInstitutionIds },
    { disabled: relatedInstitutionIds.length === 0 },
  )
  const [_institutionIds, institutions, _institutionsById] = useMemo(() => {
    const institutionsById = keyByToMap(institutionsQuery.data?.results ?? [], (institution) => {
      return institution.id
    })
    const institutionIds = Array.from(institutionsById.keys())
    const institutions = Array.from(institutionsById.values())
    return [institutionIds, institutions, institutionsById]
  }, [institutionsQuery.data])

  return {
    persons,
    institutions,
    relationsByPerson_Inst,
    relationsByInstitution_Pers,
  }
}
