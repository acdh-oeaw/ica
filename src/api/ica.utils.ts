import type { Person } from '@/api/ica.models'

export function getPersonFullName(person: Person): string {
  return [person.first_name, person.name].filter(Boolean).join(' ')
}

export interface QueryOptions {
  disabled?: boolean
}
