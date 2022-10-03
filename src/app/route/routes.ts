type Href<T extends PageParamsInput = never> = { pathname: string; searchParams?: T; hash?: string }

export function home(hash?: string): Href {
  return { pathname: '/', hash }
}

export function imprint(hash?: string): Href {
  return { pathname: '/imprint', hash }
}

export function visualisation(hash?: string): Href {
  return { pathname: '/visualisation', hash }
}
