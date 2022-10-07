import { PageMetadata } from '@stefanprobst/next-page-metadata'
import { Fragment, useEffect, useMemo, useState } from 'react'
import type { LngLat, MapLayerMouseEvent } from 'react-map-gl'
import { Popup } from 'react-map-gl'

import { useI18n } from '@/app/i18n/use-i18n'
import { withDictionaries } from '@/app/i18n/with-dictionaries'
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template'
import { FilterControlsPanel } from '@/components/filter-controls-panel'
import { MainContent } from '@/components/main-content'
import { MultiComboBox } from '@/components/multi-combobox'
import { PopoverContent } from '@/components/popover-content'
import { RangeSlider } from '@/components/range-slider'
import { db } from '@/db'
import type { Place } from '@/db/types'
import { GeoMap } from '@/features/map/geo-map'
import { initialViewState, mapStyle } from '@/features/map/geo-map.config'
import type { PlaceFeature, SerializablePlaceRelationsMap } from '@/features/map/persons-layer'
import { PersonsLayer, personsLayerStyle } from '@/features/map/persons-layer'
import { useGeoMapFilters } from '@/features/map/use-geo-map-filters'

export const getStaticProps = withDictionaries(['common'])

interface Popover {
  place: Place
  relations: SerializablePlaceRelationsMap
  coordinates: LngLat
}

const layerIds = [personsLayerStyle.id]

export default function GeoVisualisationPage(): JSX.Element {
  const { t } = useI18n<'common'>()
  const titleTemplate = usePageTitleTemplate()
  const filters = useGeoMapFilters()

  const metadata = { title: t(['common', 'pages', 'geo-visualisation', 'metadata', 'title']) }

  const formId = 'geo-visualisation-filter-controls'
  const messages = useMemo(() => {
    return {
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
      relationTypes: {
        placeholder: t(['common', 'form', 'search']),
        nothingFound: t(['common', 'form', 'nothing-found']),
        removeSelectedKey(label: string) {
          return t(['common', 'form', 'remove-item'], { values: { item: label } })
        },
      },
    }
  }, [t])

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
    const { id, relations: stringifiedContent } = feature.properties

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const place = db.places.get(id)!

    /**
     * Note that `mapbox-gl` json-stringifies any feature properties on events.
     *
     * @see https://github.com/mapbox/mapbox-gl-js/issues/2434
     */
    const relations = JSON.parse(
      stringifiedContent as unknown as string,
    ) as SerializablePlaceRelationsMap

    togglePopover({ place, relations, coordinates: lngLat })
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
      <MainContent className="relative grid grid-cols-[1fr_384px]">
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
                <PopoverContent
                  onClose={() => {
                    togglePopover(popover)
                  }}
                  place={popover.place}
                  relations={popover.relations}
                />
              </Popup>
            )
          })}
        </GeoMap>
        <FilterControlsPanel name={formId}>
          <section className="grid gap-4">
            <h2 className="text-sm font-medium text-neutral-600">Filter persons</h2>
            <div className="grid gap-6" role="group">
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
            </div>
          </section>
          <hr />
          <section className="grid gap-4">
            <h2 className="text-sm font-medium text-neutral-600">Filter relations</h2>
            <div className="grid gap-6">
              <MultiComboBox
                items={db.relationTypes}
                messages={messages.relationTypes}
                name="relation-types"
                label="Relation types"
                onSelectionChange={filters.setSelectedRelationTypes}
                selectedKeys={filters.selectedRelationTypes}
              />
              <RangeSlider
                label="Date range"
                minValue={1900}
                maxValue={2000}
                name="date-range"
                onChange={filters.setSelectedDateRange}
                value={filters.selectedDateRange}
              />
            </div>
          </section>
        </FilterControlsPanel>
      </MainContent>
    </Fragment>
  )
}
