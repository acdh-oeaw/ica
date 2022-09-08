import type { RequestOptions } from '@stefanprobst/request'
import { createUrl, request } from '@stefanprobst/request'
import type { SWRConfiguration } from 'swr'
import useQuery from 'swr'

import type {
  Collection,
  Event,
  EventPlaceRelation,
  Institution,
  InstitutionPlaceRelation,
  Person,
  PersonPersonRelation,
  PersonPlaceRelation,
  Place,
  PlacePlaceRelation,
  WithRelations,
  Work,
  WorkPlaceRelation,
} from '@/api/ica.models'
import type { PaginatedResponse } from '@/api/ica.types'
import type { QueryOptions } from '@/api/ica.utils'
import { baseUrl, limit as defaultLimit } from '~/config/ica.config'

// TODO: figure out how sorting is supposed to work. @see https://github.com/acdh-oeaw/apis-core/issues/339

// --- Entities ---

export function getEvents(params: {
  collection?: Collection['id']
  ids?: Array<Event['id']>
}): Promise<PaginatedResponse<Event>> {
  const url = createUrl({
    baseUrl,
    pathname: '/apis/api/entities/event/',
    searchParams: {
      collection: params.collection,
      id__in: params.ids?.join(','),
      limit: defaultLimit,
    },
  })
  const options: RequestOptions = { responseType: 'json' }

  return request(url, options)
}

export function getEventById(params: { id: Event['id'] }): Promise<WithRelations<Event>> {
  const url = createUrl({
    baseUrl,
    pathname: `/apis/api/entities/event/${params.id}/`,
  })
  const options: RequestOptions = { responseType: 'json' }

  return request(url, options)
}

export function getInstitutions(params: {
  collection?: Collection['id']
  ids?: Array<Institution['id']>
}): Promise<PaginatedResponse<Institution>> {
  const url = createUrl({
    baseUrl,
    pathname: '/apis/api/entities/institution/',
    searchParams: {
      collection: params.collection,
      id__in: params.ids?.join(','),
      limit: defaultLimit,
    },
  })
  const options: RequestOptions = { responseType: 'json' }

  return request(url, options)
}

export function getInstitutionById(params: {
  id: Institution['id']
}): Promise<WithRelations<Institution>> {
  const url = createUrl({
    baseUrl,
    pathname: `/apis/api/entities/institution/${params.id}/`,
  })
  const options: RequestOptions = { responseType: 'json' }

  return request(url, options)
}

export function getPersons(params: {
  collection?: Collection['id']
  ids?: Array<Person['id']>
}): Promise<PaginatedResponse<Person>> {
  const url = createUrl({
    baseUrl,
    pathname: '/apis/api/entities/person/',
    searchParams: {
      collection: params.collection,
      id__in: params.ids?.join(','),
      limit: defaultLimit,
    },
  })
  const options: RequestOptions = { responseType: 'json' }

  return request(url, options)
}

export function getPersonById(params: { id: Person['id'] }): Promise<WithRelations<Person>> {
  const url = createUrl({
    baseUrl,
    pathname: `/apis/api/entities/person/${params.id}/`,
  })
  const options: RequestOptions = { responseType: 'json' }

  return request(url, options)
}

export function getPlaces(params: {
  collection?: Collection['id']
  ids?: Array<Place['id']>
}): Promise<PaginatedResponse<Place>> {
  const url = createUrl({
    baseUrl,
    pathname: '/apis/api/entities/place/',
    searchParams: {
      collection: params.collection,
      id__in: params.ids?.join(','),
      limit: defaultLimit,
    },
  })
  const options: RequestOptions = { responseType: 'json' }

  return request(url, options)
}

export function getPlaceById(params: { id: Place['id'] }): Promise<WithRelations<Place>> {
  const url = createUrl({
    baseUrl,
    pathname: `/apis/api/entities/place/${params.id}/`,
  })
  const options: RequestOptions = { responseType: 'json' }

  return request(url, options)
}

export function getWorks(params: {
  collection?: Collection['id']
  ids?: Array<Work['id']>
}): Promise<PaginatedResponse<Work>> {
  const url = createUrl({
    baseUrl,
    pathname: '/apis/api/entities/work/',
    searchParams: {
      collection: params.collection,
      id__in: params.ids?.join(','),
      limit: defaultLimit,
    },
  })
  const options: RequestOptions = { responseType: 'json' }

  return request(url, options)
}

export function getWorkById(params: { id: Work['id'] }): Promise<WithRelations<Work>> {
  const url = createUrl({
    baseUrl,
    pathname: `/apis/api/entities/work/${params.id}/`,
  })
  const options: RequestOptions = { responseType: 'json' }

  return request(url, options)
}

// --- Entities hooks ---

export function useEvents(
  params: { collection?: Collection['id']; ids?: Array<Event['id']> },
  options?: QueryOptions & SWRConfiguration<PaginatedResponse<Event>, Error>,
) {
  return useQuery(
    options?.disabled === true ? null : ['getEvents'],
    () => {
      return getEvents(params)
    },
    { keepPreviousData: true, ...options },
  )
}

export function useEventById(
  params: { id: Event['id'] },
  options?: QueryOptions & SWRConfiguration<WithRelations<Event>, Error>,
) {
  return useQuery(
    options?.disabled === true ? null : ['getEventById', params],
    () => {
      return getEventById(params)
    },
    { keepPreviousData: true, ...options },
  )
}

export function useInstitutions(
  params: { collection?: Collection['id']; ids?: Array<Institution['id']> },
  options?: QueryOptions & SWRConfiguration<PaginatedResponse<Institution>, Error>,
) {
  return useQuery(
    options?.disabled === true ? null : ['getInstitutions'],
    () => {
      return getInstitutions(params)
    },
    { keepPreviousData: true, ...options },
  )
}

export function useInstitutionById(
  params: { id: Institution['id'] },
  options?: QueryOptions & SWRConfiguration<WithRelations<Institution>, Error>,
) {
  return useQuery(
    options?.disabled === true ? null : ['getInstitutionById', params],
    () => {
      return getInstitutionById(params)
    },
    { keepPreviousData: true, ...options },
  )
}

export function usePersons(
  params: { collection?: Collection['id']; ids?: Array<Person['id']> },
  options?: QueryOptions & SWRConfiguration<PaginatedResponse<Person>, Error>,
) {
  return useQuery(
    options?.disabled === true ? null : ['getPersons'],
    () => {
      return getPersons(params)
    },
    { keepPreviousData: true, ...options },
  )
}

export function usePersonById(
  params: { id: Person['id'] },
  options?: QueryOptions & SWRConfiguration<WithRelations<Person>, Error>,
) {
  return useQuery(
    options?.disabled === true ? null : ['getPersonById', params],
    () => {
      return getPersonById(params)
    },
    { keepPreviousData: true, ...options },
  )
}

export function usePlaces(
  params: { collection?: Collection['id']; ids?: Array<Place['id']> },
  options?: QueryOptions & SWRConfiguration<PaginatedResponse<Place>, Error>,
) {
  return useQuery(
    options?.disabled === true ? null : ['getPlaces'],
    () => {
      return getPlaces(params)
    },
    { keepPreviousData: true, ...options },
  )
}

export function usePlaceById(
  params: { id: Place['id'] },
  options?: QueryOptions & SWRConfiguration<WithRelations<Place>, Error>,
) {
  return useQuery(
    options?.disabled === true ? null : ['getPlaceById', params],
    () => {
      return getPlaceById(params)
    },
    { keepPreviousData: true, ...options },
  )
}

export function useWorks(
  params: { collection?: Collection['id']; ids?: Array<Work['id']> },
  options?: QueryOptions & SWRConfiguration<PaginatedResponse<Work>, Error>,
) {
  return useQuery(
    options?.disabled === true ? null : ['getWorks'],
    () => {
      return getWorks(params)
    },
    { keepPreviousData: true, ...options },
  )
}

export function useWorkById(
  params: { id: Work['id'] },
  options?: QueryOptions & SWRConfiguration<WithRelations<Work>, Error>,
) {
  return useQuery(
    options?.disabled === true ? null : ['getWorkById', params],
    () => {
      return getWorkById(params)
    },
    { keepPreviousData: true, ...options },
  )
}

// -- Relations to places ---

export function getEventPlaceRelations(params: {
  ids?: Array<Event['id']>
}): Promise<PaginatedResponse<EventPlaceRelation>> {
  const url = createUrl({
    baseUrl,
    pathname: '/apis/api/relations/placeevent/',
    searchParams: { related_event__id__in: params.ids?.join(','), limit: defaultLimit },
  })
  const options: RequestOptions = { responseType: 'json' }

  return request(url, options)
}

export function getInstitutionPlaceRelations(params: {
  ids?: Array<Institution['id']>
}): Promise<PaginatedResponse<InstitutionPlaceRelation>> {
  const url = createUrl({
    baseUrl,
    pathname: '/apis/api/relations/institutionplace/',
    searchParams: { related_institution__id__in: params.ids?.join(','), limit: defaultLimit },
  })
  const options: RequestOptions = { responseType: 'json' }

  return request(url, options)
}

export function getPersonPlaceRelations(params: {
  ids?: Array<Person['id']>
}): Promise<PaginatedResponse<PersonPlaceRelation>> {
  const url = createUrl({
    baseUrl,
    pathname: '/apis/api/relations/personplace/',
    searchParams: { related_person__id__in: params.ids?.join(','), limit: defaultLimit },
  })
  const options: RequestOptions = { responseType: 'json' }

  return request(url, options)
}

export function getPlacePlaceRelations(params: {
  ids?: Array<Place['id']>
}): Promise<PaginatedResponse<PlacePlaceRelation>> {
  const url = createUrl({
    baseUrl,
    pathname: '/apis/api/relations/placeplace/',
    searchParams: { related_place__id__in: params.ids?.join(','), limit: defaultLimit },
  })
  const options: RequestOptions = { responseType: 'json' }

  return request(url, options)
}

export function getWorkPlaceRelations(params: {
  ids?: Array<Work['id']>
}): Promise<PaginatedResponse<WorkPlaceRelation>> {
  const url = createUrl({
    baseUrl,
    pathname: '/apis/api/relations/placework/',
    searchParams: { related_work__id__in: params.ids?.join(','), limit: defaultLimit },
  })
  const options: RequestOptions = { responseType: 'json' }

  return request(url, options)
}

// -- Relations to places hooks ---

export function useEventPlaceRelations(
  params: { ids?: Array<Event['id']> },
  options?: QueryOptions & SWRConfiguration<PaginatedResponse<EventPlaceRelation>, Error>,
) {
  return useQuery(
    options?.disabled === true ? null : ['getEventPlaceRelations', params],
    () => {
      return getEventPlaceRelations(params)
    },
    { keepPreviousData: true, ...options },
  )
}

export function useInstitutionPlaceRelations(
  params: { ids?: Array<Institution['id']> },
  options?: QueryOptions & SWRConfiguration<PaginatedResponse<InstitutionPlaceRelation>, Error>,
) {
  return useQuery(
    options?.disabled === true ? null : ['getInstitutionPlaceRelations', params],
    () => {
      return getInstitutionPlaceRelations(params)
    },
    { keepPreviousData: true, ...options },
  )
}

export function usePersonPlaceRelations(
  params: { ids?: Array<Person['id']> },
  options?: QueryOptions & SWRConfiguration<PaginatedResponse<PersonPlaceRelation>, Error>,
) {
  return useQuery(
    options?.disabled === true ? null : ['getPersonPlaceRelations', params],
    () => {
      return getPersonPlaceRelations(params)
    },
    { keepPreviousData: true, ...options },
  )
}

export function usePlacePlaceRelations(
  params: { ids?: Array<Place['id']> },
  options?: QueryOptions & SWRConfiguration<PaginatedResponse<PlacePlaceRelation>, Error>,
) {
  return useQuery(
    options?.disabled === true ? null : ['getPlacePlaceRelations', params],
    () => {
      return getPlacePlaceRelations(params)
    },
    { keepPreviousData: true, ...options },
  )
}

export function useWorkPlaceRelations(
  params: { ids?: Array<Work['id']> },
  options?: QueryOptions & SWRConfiguration<PaginatedResponse<WorkPlaceRelation>, Error>,
) {
  return useQuery(
    options?.disabled === true ? null : ['getWorkPlaceRelations', params],
    () => {
      return getWorkPlaceRelations(params)
    },
    { keepPreviousData: true, ...options },
  )
}

// PersonPerson Relation

export function getPersonPersonRelations(params: {
  ids?: Array<Person['id']>
}): Promise<PaginatedResponse<PersonPersonRelation>> {
  const url = createUrl({
    baseUrl,
    pathname: '/apis/api/relations/personperson/',
    searchParams: { related_person__id__in: params.ids?.join(','), limit: defaultLimit },
  })
  const options: RequestOptions = { responseType: 'json' }

  return request(url, options)
}

export function usePersonPersonRelations(
  params: { ids?: Array<Person['id']> },
  options?: QueryOptions & SWRConfiguration<PaginatedResponse<PersonPersonRelation>, Error>,
) {
  return useQuery(
    options?.disabled === true ? null : ['getPersonPersonRelations', params],
    () => {
      return getPersonPersonRelations(params)
    },
    { keepPreviousData: true, ...options },
  )
}
