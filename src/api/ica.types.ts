export interface PaginatedResponse<T> {
  count: number
  limit: number
  offset: number
  next: UrlString | null
  previous: UrlString | null
  results: Array<T>
}
