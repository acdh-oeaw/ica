import type { Dispatch, SetStateAction } from 'react'
import { useMemo, useState } from 'react'

import type { Person, Place, ProfessionBase as Profession } from '@/db/types'

export interface NetworkGraphFilters {
  selectedPersons: Array<Person['id']>
  setSelectedPersons: Dispatch<SetStateAction<Array<Person['id']>>>
  selectedProfessions: Array<Profession['id']>
  setSelectedProfessions: Dispatch<SetStateAction<Array<Profession['id']>>>
}

export function useNetworkGraphFilters(): NetworkGraphFilters {
  const [selectedPersons, setSelectedPersons] = useState<Array<Person['id']>>([])
  const [selectedProfessions, setSelectedProfessions] = useState<Array<Place['id']>>([])

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
    }
  }, [selectedPersons, setSelectedPersons, selectedProfessions, setSelectedProfessions])

  return filters
}
