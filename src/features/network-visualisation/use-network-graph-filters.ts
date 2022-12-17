import type { Dispatch, SetStateAction } from 'react'
import { useMemo, useState } from 'react'

import type { Person, Place, ProfessionBase as Profession, RelationType } from '@/db/types'

export interface NetworkGraphFilters {
  selectedPersons: Array<Person['id']>
  setSelectedPersons: Dispatch<SetStateAction<Array<Person['id']>>>
  selectedProfessions: Array<Profession['id']>
  setSelectedProfessions: Dispatch<SetStateAction<Array<Profession['id']>>>
  selectedRelationTypes: Array<RelationType['id']>
  setSelectedRelationTypes: Dispatch<SetStateAction<Array<RelationType['id']>>>
  selectedDateRange: [number, number]
  setSelectedDateRange: Dispatch<SetStateAction<[number, number]>>
}

export function useNetworkGraphFilters(): NetworkGraphFilters {
  const [selectedPersons, setSelectedPersons] = useState<Array<Person['id']>>([])
  const [selectedProfessions, setSelectedProfessions] = useState<Array<Place['id']>>([])
  const [selectedRelationTypes, setSelectedRelationTypes] = useState<Array<RelationType['id']>>([])
  const [selectedDateRange, setSelectedDateRange] = useState<[number, number]>([1900, 2000])

  const filters: NetworkGraphFilters = useMemo(() => {
    /**
     * Filtering by person name, and filtering by profession is mutually exclusive.
     */
    function _setSelectedPersons(...args: Parameters<typeof setSelectedPersons>) {
      setSelectedPersons(...args)
      setSelectedProfessions([])
    }
    function _setSelectedProfessions(...args: Parameters<typeof setSelectedProfessions>) {
      setSelectedProfessions(...args)
      setSelectedPersons([])
    }

    return {
      selectedPersons,
      setSelectedPersons: _setSelectedPersons,
      selectedProfessions,
      setSelectedProfessions: _setSelectedProfessions,
      selectedRelationTypes,
      setSelectedRelationTypes,
      selectedDateRange,
      setSelectedDateRange,
    }
  }, [
    selectedPersons,
    setSelectedPersons,
    selectedProfessions,
    setSelectedProfessions,
    selectedRelationTypes,
    setSelectedRelationTypes,
    selectedDateRange,
    setSelectedDateRange,
  ])

  return filters
}
