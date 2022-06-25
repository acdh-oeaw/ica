import { PageMetadata } from '@stefanprobst/next-page-metadata'
import { Fragment } from 'react'

import { useI18n } from '@/app/i18n/use-i18n'
import { withDictionaries } from '@/app/i18n/with-dictionaries'
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template'
import { usePersonsPlaces } from '@/lib/use-persons-places'

export const getStaticProps = withDictionaries(['common'])

export default function HomePage(): JSX.Element {
  const { t } = useI18n<'common'>()
  const titleTemplate = usePageTitleTemplate()

  const metadata = { title: t(['common', 'home', 'metadata', 'title']) }

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <main>
        <Hero />
        <section>
          <h3>Places</h3>
          <PlacesList />
        </section>
      </main>
    </Fragment>
  )
}

function Hero(): JSX.Element {
  return (
    <div className="mx-auto grid max-w-6xl place-items-center gap-8 py-48 px-8">
      <div className="grid gap-4">
        <h1 className="text-5xl font-extrabold">Ideas Crossing the Atlantic</h1>
        <h2 className="text-2xl font-bold">Theories, Normative Conceptions, and Cultural Images</h2>
      </div>
      <p className="text-lg leading-relaxed">
        The resurgence of nationalisms worldwide has reignited scholarly interest in the
        dissemination of ideas and cultural concepts across political and geographic borders and
        especially across the Atlantic. This volume is the result of an international gathering held
        in December 2016 at the Austrian Academy of Sciences, which was devoted to the exploration
        of (voluntary and enforced) transcultural migrations before, during, and after the two World
        Wars. In 25 incisive, wide-ranging chapters, scholars from Austria, Canada, the Czech
        Republic, France, Germany, Hungary, Italy, Poland, Slovenia, Spain, the United Kingdom, and
        the United States, revisit a century marked by international connectedness and productive
        cross-fertilization in the fields of literature, philosophy, science, and the arts. Taken as
        a whole, these essays offer a powerful antidote to new attempts to redraw the world&apos;s
        boundaries according to ethnocultural dividing lines.
      </p>
    </div>
  )
}

function PlacesList(): JSX.Element {
  const { places } = usePersonsPlaces()
  const placesWithCoordinates = places.filter((place) => {
    if (place.lat != null && place.lng != null) return true
    console.info(`${place.name} has no coordinates`)
    return false
  })

  return (
    <ul role="list">
      {placesWithCoordinates.map((place) => {
        return (
          <li key={place.id} className="flex gap-2">
            {place.name}
            <span className="text-gray-400">
              [{place.lat}, {place.lng}]
            </span>
          </li>
        )
      })}
    </ul>
  )
}
