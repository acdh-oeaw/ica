interface RelationType {
  id: string
  label: string
}

interface Relation<S extends Entity, T extends Entity> {
  id: string
  source: S['id']
  target: T['id']
  type: RelationType['id']
  startDate: IsoDateString | null
  endDate: IsoDateString | null
  startDateWritten: string | null
  endDateWritten: string | null
}

export interface Institution {
  kind: 'institution'
  id: string
  label: string
  persons: Set<Relation<Person, Person>['id']>
  places: Set<Relation<Person, Place>['id']>
  institutions: Set<Relation<Person, Institution>['id']>
}

export interface Person {
  kind: 'person'
  id: string
  label: string
  gender: string
  notes: string | null
  references: string | null
  startDate: IsoDateString | null
  endDate: IsoDateString | null
  startDateWritten: string | null
  endDateWritten: string | null
  professions: Set<ProfessionBase['id']>
  persons: Set<Relation<Person, Person>['id']>
  places: Set<Relation<Person, Place>['id']>
  institutions: Set<Relation<Person, Institution>['id']>
  events: Set<Relation<Person, Event>['id']>
}

export interface Place {
  kind: 'place'
  id: string
  label: string
  coordinates: [number, number]
  persons: Set<Relation<Person, Person>['id']>
  places: Set<Relation<Person, Place>['id']>
  institutions: Set<Relation<Person, Institution>['id']>
}

export interface ProfessionBase {
  kind: 'profession'
  id: string
  label: string
}

export interface Event {
  kind: 'event'
  id: string
  label: string
  persons: Set<Relation<Person, Person>['id']>
  places: Set<Relation<Person, Place>['id']>
  institutions: Set<Relation<Person, Institution>['id']>
}

interface Work {
  kind: 'work'
  id: string
  label: string
}

export type Entity = Event | Institution | Person | Place | Work

export type EntityKind = Entity['kind']

export type EntityBase = Pick<Entity, 'id' | 'kind' | 'label'>

export interface Database {
  events: Map<Event['id'], Event>
  institutions: Map<Institution['id'], Institution>
  persons: Map<Person['id'], Person>
  places: Map<Place['id'], Place>
  professions: Map<ProfessionBase['id'], ProfessionBase>
}
