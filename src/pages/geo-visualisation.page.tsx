import { PageMetadata } from '@stefanprobst/next-page-metadata'
import { Fragment, useEffect, useMemo, useState } from 'react'
import type { LngLat, MapLayerMouseEvent } from 'react-map-gl'
import { Popup } from 'react-map-gl'

import { useI18n } from '@/app/i18n/use-i18n'
import { withDictionaries } from '@/app/i18n/with-dictionaries'
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template'
import { MainContent } from '@/components/main-content'
import { MultiComboBox } from '@/components/multi-combobox'
// import { RangeSlider } from '@/components/range-slider'
import { db } from '@/db'
import type { Place } from '@/db/types'
import { FilterControlsPanel } from '@/features/map/filter-controls-panel'
import { GeoMap } from '@/features/map/geo-map'
import { initialViewState, mapStyle } from '@/features/map/geo-map.config'
import type { PlaceContentArrays, PlaceFeature } from '@/features/map/persons-layer'
import { PersonsLayer, personsLayerStyle } from '@/features/map/persons-layer'
import { useFilters } from '@/features/map/use-filters'

export const getStaticProps = withDictionaries(['common'])

const layerIds = [personsLayerStyle.id]

export default function GeoVisualisationPage(): JSX.Element {
  const { t } = useI18n<'common'>()
  const titleTemplate = usePageTitleTemplate()
  const filters = useFilters()

  const metadata = { title: t(['common', 'pages', 'geo-visualisation', 'metadata', 'title']) }

  const formId = 'filter-controls'
  const messages = useMemo(() => {
    return {
      places: {
        placeholder: t(['common', 'form', 'search']),
        nothingFound: t(['common', 'form', 'nothing-found']),
        removeSelectedKey(label: string) {
          return t(['common', 'form', 'remove-item'], { values: { item: label } })
        },
      },
      persons: {
        placeholder: t(['common', 'form', 'search']),
        nothingFound: t(['common', 'form', 'nothing-found']),
        removeSelectedKey(label: string) {
          return t(['common', 'form', 'remove-item'], { values: { item: label } })
        },
      },
      professions: {
        placeholder: t(['common', 'form', 'search']),
        nothingFound: t(['common', 'form', 'nothing-found']),
        removeSelectedKey(label: string) {
          return t(['common', 'form', 'remove-item'], { values: { item: label } })
        },
      },
    }
  }, [t])

  interface Popover {
    place: Place
    content: PlaceContentArrays
    coordinates: LngLat
  }

  const [cursor, setCursor] = useState<'auto' | 'pointer'>('auto')
  const [popovers, setPopovers] = useState<Record<Place['id'], Popover>>({})

  function togglePopover(popover: Popover) {
    const id = popover.place.id

    if (id in popovers) {
      const p = { ...popovers }
      delete p[id]
      setPopovers(p)
    } else {
      setPopovers({ ...popovers, [id]: popover })
    }
  }

  function onTogglePopover(event: MapLayerMouseEvent) {
    const { features, lngLat } = event
    const _feature = features?.[0]
    if (_feature == null) return

    const feature = _feature as unknown as PlaceFeature
    const { id, content: stringifiedContent } = feature.properties

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const place = db.places.get(id)!

    /**
     * Note that `mapbox-gl` json-stringifies any feature properties on events.
     *
     * @see https://github.com/mapbox/mapbox-gl-js/issues/2434
     */
    const content = JSON.parse(stringifiedContent as unknown as string) as PlaceContentArrays

    togglePopover({ place, content, coordinates: lngLat })
  }

  function onMouseEnter() {
    setCursor('pointer')
  }

  function onMouseLeave() {
    setCursor('auto')
  }

  /** Avoid popover staying open for a point which is no longer in the selection set. */
  useEffect(() => {
    setPopovers({})
  }, [filters])

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <MainContent className="relative grid">
        <GeoMap
          cursor={cursor}
          initialViewState={initialViewState}
          interactiveLayerIds={layerIds}
          mapStyle={mapStyle.positron}
          onClick={onTogglePopover}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <PersonsLayer filters={filters} />
          {Object.entries(popovers).map(([id, popover]) => {
            return (
              <Popup
                key={id}
                closeButton={false}
                closeOnClick={false}
                latitude={popover.coordinates.lat}
                longitude={popover.coordinates.lng}
                onClose={() => {
                  togglePopover(popover)
                }}
              >
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                <div
                  className="grid gap-0.5 pt-1"
                  onClick={() => {
                    togglePopover(popover)
                  }}
                >
                  <h3 className="font-semibold">{popover.place.label}</h3>
                  <ul className="grid gap-0.5 text-xs" role="list">
                    {popover.content.events.map((eventId) => {
                      const event = db.events.get(eventId)
                      if (event == null) return null

                      return <li key={eventId}>{event.label}</li>
                    })}
                    {popover.content.institutions.map((institutionId) => {
                      const event = db.institutions.get(institutionId)
                      if (event == null) return null

                      return <li key={institutionId}>{event.label}</li>
                    })}
                    {popover.content.persons.map((personId) => {
                      const event = db.persons.get(personId)
                      if (event == null) return null

                      return <li key={personId}>{event.label}</li>
                    })}
                  </ul>
                </div>
              </Popup>
            )
          })}
        </GeoMap>
        <FilterControlsPanel name={formId}>
          <MultiComboBox
            items={db.persons}
            messages={messages.persons}
            name="persons"
            label="Persons"
            onSelectionChange={filters.setSelectedPersons}
            selectedKeys={filters.selectedPersons}
          />
          <MultiComboBox
            items={db.professions}
            messages={messages.professions}
            name="professions"
            label="Professions"
            onSelectionChange={filters.setSelectedProfessions}
            selectedKeys={filters.selectedProfessions}
          />
          {/* <RangeSlider label="Date range" minValue={0} maxValue={20} /> */}
        </FilterControlsPanel>
      </MainContent>
    </Fragment>
  )
}
