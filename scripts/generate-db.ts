import '@stefanprobst/request/fetch'

import fs from 'node:fs/promises'
import path from 'node:path'

import { log } from '@stefanprobst/log'
import config from '@stefanprobst/prettier-config'
import type { RequestOptions } from '@stefanprobst/request'
import { createUrl, HttpError, request } from '@stefanprobst/request'
// @ts-expect-error ts does not yet fully understand package exports.
import { timeout } from '@stefanprobst/request/timeout'
import { format } from 'prettier'
import serialize from 'serialize-javascript'

import type {
  Database,
  EntityBase,
  EntityKind,
  Event,
  Institution,
  Person,
  Place,
  ProfessionBase,
} from '@/db/types'

//

const baseUrl = 'https://ica.acdh-dev.oeaw.ac.at/apis/api/'
const options: RequestOptions = {
  responseType: 'json',
  fetch: (timeout as (ms: number) => typeof global.fetch)(60000),
}
const collectionId = 13 /** `webclient` collection */
const limit = 1000

//

interface ApisPaginatedResponse<T> {
  next: string | null
  previous: string | null
  count: number
  limit: number
  offset: number
  results: Array<T>
}

type ApisEntityType = 'Event' | 'Institution' | 'Person' | 'Place' | 'Work'

interface ApisRelationBase {
  id: number
  label: string
  relation_type: ApisRelationTypeBase
  related_entity: ApisRelatedEntity
}

interface ApisRelationTypeBase {
  id: number
  label: string
}

interface ApisRelatedEntity {
  id: number
  label: string
  type: ApisEntityType
}

interface ApisInstitutionBase {
  id: number
  name: string
  start_date: string | null
  end_date: string | null
  start_date_written: string | null
  end_date_written: string | null
  references: string | null
  notes: string | null
}

interface ApisInstitution extends ApisInstitutionBase {
  relations: Array<ApisRelationBase>
}

interface ApisPersonBase {
  id: number
  name: string
  first_name: string
  gender: string
  start_date: string | null
  end_date: string | null
  start_date_written: string | null
  end_date_written: string | null
  references: string | null
  notes: string | null
  profession: Array<{ id: number; label: string }>
}

interface ApisPerson extends ApisPersonBase {
  relations: Array<ApisRelationBase>
}

interface ApisProfessionBase {
  id: number
  label: string
}

interface ApisPlaceBase {
  id: number
  name: string
  start_date: string | null
  end_date: string | null
  start_date_written: string | null
  end_date_written: string | null
  references: string | null
  notes: string | null
  lat: number
  lng: number
}

interface ApisPlace extends ApisPlaceBase {
  relations: Array<ApisRelationBase>
}

interface ApisEventBase {
  id: number
  name: string
  start_date: string | null
  end_date: string | null
  start_date_written: string | null
  end_date_written: string | null
  references: string | null
  notes: string | null
}

interface ApisEvent extends ApisEventBase {
  relations: Array<ApisRelationBase>
}

//

function createEvent(value: ApisEvent): Event {
  return {
    kind: 'event',
    id: String(value.id),
    label: value.name,
    persons: new Set(),
    places: new Set(),
    institutions: new Set(),
    events: new Set(),
  }
}

function createInstitution(value: ApisInstitution): Institution {
  return {
    kind: 'institution',
    id: String(value.id),
    label: value.name,
    persons: new Set(),
    places: new Set(),
    institutions: new Set(),
    events: new Set(),
  }
}

function createPerson(person: ApisPersonBase): Person {
  return {
    kind: 'person',
    id: String(person.id),
    label: [person.first_name, person.name].filter(Boolean).join(' '),
    startDate: person.start_date,
    endDate: person.end_date,
    startDateWritten: person.start_date_written,
    endDateWritten: person.end_date_written,
    references: person.references,
    notes: person.notes,
    gender: person.gender,
    professions: new Set(),
    persons: new Set(),
    places: new Set(),
    institutions: new Set(),
    events: new Set(),
  }
}

function createPlace(value: ApisPlace): Place {
  return {
    kind: 'place',
    id: String(value.id),
    label: value.name,
    coordinates: [value.lng, value.lat],
    persons: new Set(),
    places: new Set(),
    institutions: new Set(),
    events: new Set(),
  }
}

function createProfessionBase(value: ApisProfessionBase): ProfessionBase {
  return {
    kind: 'profession',
    id: String(value.id),
    label: value.label,
  }
}

function createEntityBase(value: ApisRelationBase['related_entity']): EntityBase {
  return {
    id: String(value.id),
    label: value.label,
    kind: value.type.toLowerCase() as EntityKind,
  }
}

//

async function addPersonById(
  value: EntityBase,
  db: Database,
  collection: Set<Person['id']>,
): Promise<void> {
  if (db.persons.has(value.id)) return

  const url = createUrl({ pathname: `entities/person/${value.id}/`, baseUrl })

  log.info(`Fetching person ${value.label}.`)
  const response = (await request(url, options)) as ApisPerson

  const person = createPerson(response)
  db.persons.set(person.id, person)

  for (const value of response.profession) {
    const profession = createProfessionBase(value)
    db.professions.set(profession.id, profession)
    person.professions.add(profession.id)
  }

  for (const value of response.relations) {
    const entity = createEntityBase(value.related_entity)

    // TODO:
    const _type = { id: String(value.relation_type.id), label: value.relation_type.label }

    if (entity.kind === 'person') {
      /** we are only interested in persons in the `webclient` collection. */
      if (!collection.has(entity.id)) continue

      await addPersonById(entity, db, collection)
      person.persons.add(entity.id)
    } else if (entity.kind === 'place') {
      person.places.add(entity.id)
      await addPlaceById(entity, db)
      db.places.get(entity.id)?.persons.add(person.id)
    } else if (entity.kind === 'institution') {
      person.institutions.add(entity.id)
      await addInstitutionById(entity, db)
      db.institutions.get(entity.id)?.persons.add(person.id)
    } else if (entity.kind === 'event') {
      person.events.add(entity.id)
      await addEventById(entity, db)
      db.events.get(entity.id)?.persons.add(person.id)
    } else {
      /** not interested in works */
    }
  }
}

async function addInstitutionById(value: EntityBase, db: Database): Promise<void> {
  if (db.institutions.has(value.id)) return

  const url = createUrl({ pathname: `entities/institution/${value.id}/`, baseUrl })

  log.info(`Fetching institution ${value.label}.`)
  const response = (await request(url, options)) as ApisInstitution

  const institution = createInstitution(response)
  db.institutions.set(institution.id, institution)

  for (const value of response.relations) {
    const entity = createEntityBase(value.related_entity)

    if (entity.kind === 'place') {
      institution.places.add(entity.id)
      await addPlaceById(entity, db)
      db.places.get(entity.id)?.institutions.add(institution.id)
    } else if (entity.kind === 'person') {
      //
    }
  }
}

async function addPlaceById(value: EntityBase, db: Database): Promise<void> {
  if (db.places.has(value.id)) return

  const url = createUrl({ pathname: `entities/place/${value.id}/`, baseUrl })

  log.info(`Fetching place ${value.label}.`)
  const response = (await request(url, options)) as ApisPlace

  const place = createPlace(response)
  db.places.set(place.id, place)

  for (const value of response.relations) {
    const entity = createEntityBase(value.related_entity)

    if (entity.kind === 'place') {
      place.places.add(entity.id)
      await addPlaceById(entity, db)
      db.places.get(entity.id)?.places.add(place.id)
    }
  }
}

async function addEventById(value: EntityBase, db: Database): Promise<void> {
  if (db.events.has(value.id)) return

  const url = createUrl({ pathname: `entities/event/${value.id}/`, baseUrl })

  log.info(`Fetching event ${value.label}.`)
  const response = (await request(url, options)) as ApisEvent

  const event = createEvent(response)
  db.events.set(event.id, event)

  for (const value of response.relations) {
    const entity = createEntityBase(value.related_entity)

    if (entity.kind === 'place') {
      event.places.add(entity.id)
      await addPlaceById(entity, db)
      db.places.get(entity.id)?.events.add(event.id)
    } else if (entity.kind === 'institution') {
      //
    } else if (entity.kind === 'person') {
      //
    }
  }
}

//

async function getPersons(): Promise<Array<Person>> {
  const url = createUrl({
    pathname: 'entities/person/',
    baseUrl,
    searchParams: { collection: collectionId, limit },
  })

  log.info('Fetching persons in collection.')
  let response = (await request(url, options)) as ApisPaginatedResponse<ApisPersonBase>
  const persons = response.results.map(createPerson)
  const pages = Math.ceil(response.count / response.limit)

  while (response.next != null) {
    const page = response.offset / response.limit + 1
    log.info(`Fetching persons in collection, page ${page + 1} / ${pages}.`)
    response = (await request(
      new URL(response.next),
      options,
    )) as ApisPaginatedResponse<ApisPersonBase>
    persons.push(...response.results.map(createPerson))
  }

  return persons
}

//

async function generate() {
  const db: Database = {
    events: new Map(),
    persons: new Map(),
    professions: new Map(),
    institutions: new Map(),
    places: new Map(),
  }

  /** Persons in the `webclient` collection. */
  const persons = await getPersons()
  const ids = new Set(
    persons.map((person) => {
      return String(person.id)
    }),
  )

  for (const person of persons) {
    await addPersonById(person, db, ids)
  }

  //

  const outputFolder = path.join(process.cwd(), 'src', 'db')
  await fs.mkdir(outputFolder, { recursive: true })

  for (const [key, entities] of Object.entries(db)) {
    const filePath = path.join(outputFolder, key + '.ts')
    await fs.writeFile(
      filePath,
      format(`export const ${key} = ${serialize(entities)}`, { ...config, parser: 'typescript' }),
      { encoding: 'utf-8' },
    )
  }
}

//

/**
 * Fetch persons from the `webclient` collection, and their relations
 * to places, either direct relations:
 *
 * - person => place
 *
 * or indirect relations:
 *
 * - person => institution => place
 * - person => person => place
 * - person => place => place
 * - person => event => place
 */
generate()
  .then(() => {
    log.success('Successfully generated database.')
  })
  .catch((error) => {
    const message = error instanceof HttpError ? error.response.statusText : String(error)
    log.error('Failed to generate database.\n', message)
  })
