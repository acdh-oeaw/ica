import { institutions } from '@/db/institutions'
import { persons } from '@/db/persons'
import { places } from '@/db/places'
import { professions } from '@/db/professions'
import type { Database } from '@/db/types'

export const db = {
  institutions,
  persons,
  places,
  professions,
} as Database
