export interface RelationTypeBase {
  id: string
  label: string
}

export interface RelationType extends RelationTypeBase {
  source: EntityKind
  target: EntityKind
}

export interface RelationBase {
  id: string
  source: EntityBase
  target: EntityBase
  type: RelationTypeBase
}

export interface Relation<S extends EntityBase = EntityBase, T extends EntityBase = EntityBase> {
  id: string
  source: S
  target: T
  type: RelationTypeBase
  startDate: IsoDateString | null
  endDate: IsoDateString | null
  startDateWritten: string | null
  endDateWritten: string | null
}

export interface Institution {
  kind: 'institution'
  id: string
  label: string
  persons: Set<Relation['id']>
  places: Set<Relation['id']>
  institutions: Set<Relation['id']>
  events: Set<Relation['id']>
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
  persons: Set<Relation['id']>
  places: Set<Relation['id']>
  institutions: Set<Relation['id']>
  events: Set<Relation['id']>
}

export interface Place {
  kind: 'place'
  id: string
  label: string
  coordinates: [number, number]
  persons: Set<Relation['id']>
  places: Set<Relation['id']>
  institutions: Set<Relation['id']>
  events: Set<Relation['id']>
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
  persons: Set<Relation['id']>
  places: Set<Relation['id']>
  institutions: Set<Relation['id']>
  events: Set<Relation['id']>
}

interface Work {
  kind: 'work'
  id: string
  label: string
}

export type Entity = Event | Institution | Person | Place | Work

export type EntityKind = Entity['kind']

export type EntityBase = DistributivePick<Entity, 'id' | 'kind' | 'label'>

export interface Database {
  events: Map<Event['id'], Event>
  institutions: Map<Institution['id'], Institution>
  persons: Map<Person['id'], Person>
  places: Map<Place['id'], Place>
  professions: Map<ProfessionBase['id'], ProfessionBase>
  relations: Map<Relation['id'], Relation>
  relationTypes: Map<RelationType['id'], RelationType>
}
