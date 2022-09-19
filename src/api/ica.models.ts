interface LabeledReference {
  id: number
  url: UrlString
  label: string
}

interface Base {
  id: number
  url: UrlString
  start_date: IsoDateString | null
  start_start_date: IsoDateString | null
  start_end_date: IsoDateString | null
  end_date: IsoDateString | null
  end_start_date: IsoDateString | null
  end_end_date: IsoDateString | null
  start_date_written: string | null
  end_date_written: string | null
  review: boolean
  status: string
  references: string | null
  notes: string | null
  published: boolean
  source: LabeledReference | null
}

interface EntityBase extends Base {
  name: string
  text: Array<LabeledReference>
  collection: Array<LabeledReference>
}

export interface Event extends EntityBase {
  type: 'Event'
  kind: LabeledReference
}

export interface Institution extends EntityBase {
  type: 'Institution'
  kind: LabeledReference
}

export interface Person extends EntityBase {
  type: 'Person'
  first_name: string | null
  gender: 'female' | 'male' | 'third gender' | null
  profession: Array<LabeledReference>
  title: Array<LabeledReference>
}

export interface Place extends EntityBase {
  type: 'Place'
  lat: number | null
  lng: number | null
  kind: LabeledReference
}

export interface Work extends EntityBase {
  type: 'Work'
  kind: LabeledReference
}

export type Entity = Event | Institution | Person | Place | Work

export type EntityType = Entity['type']

export type EntityMap = {
  [Type in EntityType]: Extract<Entity, { type: Type }>
}

export interface EntityRelation {
  id: number
  url: UrlString
  label: string
  relation_type: LabeledReference
  related_entity: LabeledReference & { type: EntityType }
}

export type WithRelations<T extends Entity> = T & {
  relations: Array<EntityRelation>
}

interface RelationBase extends Base {
  relation_type: LabeledReference
}

export interface EventPlaceRelation extends RelationBase {
  related_event: LabeledReference
  related_place: LabeledReference
}

export interface InstitutionPlaceRelation extends RelationBase {
  related_institution: LabeledReference
  related_place: LabeledReference
}

export interface PersonPlaceRelation extends RelationBase {
  related_person: LabeledReference
  related_place: LabeledReference
}

export interface PersonInstitutionRelation extends RelationBase {
  related_person: LabeledReference
  related_institution: LabeledReference
}

export interface PlacePlaceRelation extends RelationBase {
  related_placeA: LabeledReference
  related_placeB: LabeledReference
}

export interface WorkPlaceRelation extends RelationBase {
  related_place: LabeledReference
  related_work: LabeledReference
}

export interface Collection {
  id: number
}

export interface PersonPersonRelation extends RelationBase {
  related_personA: LabeledReference
  related_personB: LabeledReference
}
