import type { Dispatch, SetStateAction } from 'react'
import { useMemo, useState } from 'react'

import type { Person, Place, ProfessionBase as Profession } from '@/db/types'

export interface Filters {
  selectedPersons: Array<Person['id']>
  setSelectedPersons: Dispatch<SetStateAction<Array<Person['id']>>>
  selectedPlaces: Array<Place['id']>
  setSelectedPlaces: Dispatch<SetStateAction<Array<Place['id']>>>
  selectedProfessions: Array<Profession['id']>
  setSelectedProfessions: Dispatch<SetStateAction<Array<Profession['id']>>>
}

export function useFilters(): Filters {
  const [selectedPersons, setSelectedPersons] = useState<Array<Person['id']>>([])
  const [selectedPlaces, setSelectedPlaces] = useState<Array<Place['id']>>([])
  const [selectedProfessions, setSelectedProfessions] = useState<Array<Place['id']>>([])

  const filters: Filters = useMemo(() => {
    return {
      selectedPersons,
      setSelectedPersons,
      selectedPlaces,
      setSelectedPlaces,
      selectedProfessions,
      setSelectedProfessions,
    }
  }, [
    selectedPersons,
    setSelectedPersons,
    selectedPlaces,
    setSelectedPlaces,
    selectedProfessions,
    setSelectedProfessions,
  ])

  return filters
}
