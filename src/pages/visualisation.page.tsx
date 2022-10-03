import { PageMetadata } from '@stefanprobst/next-page-metadata'
import type { Feature, Point } from 'geojson'
import { Fragment, useEffect, useMemo, useState } from 'react'
import type { LngLat, MapLayerMouseEvent } from 'react-map-gl'
import { Popup } from 'react-map-gl'

import { useI18n } from '@/app/i18n/use-i18n'
import { withDictionaries } from '@/app/i18n/with-dictionaries'
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template'
import { MainContent } from '@/components/main-content.component'
import { MultiComboBox } from '@/components/multi-combobox'
import { db } from '@/db'
import type { Entity } from '@/db/types'
import { FilterControlsPanel } from '@/features/map/filter-controls-panel'
import { GeoMap } from '@/features/map/geo-map'
import { initialViewState, mapStyle } from '@/features/map/geo-map.config'
import { PersonsLayer, personsLayerStyle, relationsLayerStyle } from '@/features/map/persons-layer'
import { useFilters } from '@/features/map/use-filters'

export const getStaticProps = withDictionaries(['common'])

const layerIds = [relationsLayerStyle.id, personsLayerStyle.id]

export default function VisualisationPage(): JSX.Element {
  const { t } = useI18n<'common'>()
  const titleTemplate = usePageTitleTemplate()
  const filters = useFilters()

  const metadata = { title: t(['common', 'pages', 'visualisation', 'metadata', 'title']) }

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

  const [cursor, setCursor] = useState<'auto' | 'pointer'>('auto')
  const [popover, setPopover] = useState<{ entity: Entity; coordinates: LngLat } | null>(null)

  function onTogglePopup(event: MapLayerMouseEvent) {
    const { features, lngLat } = event
    const _feature = features?.[0]
    if (_feature == null) {
      setPopover(null)
      return
    }

    const feature = _feature as unknown as Feature<Point, Pick<Entity, 'id' | 'kind'>>
    const { id } = feature.properties

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const entity = db.places.get(id)!
    setPopover({ entity, coordinates: lngLat })
  }

  function onMouseEnter() {
    setCursor('pointer')
  }

  function onMouseLeave() {
    setCursor('auto')
  }

  /** Avoid popover staying open for a point which is no longer in the selection set. */
  useEffect(() => {
    setPopover(null)
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
          onClick={onTogglePopup}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <PersonsLayer filters={filters} />
          {popover != null ? (
            <Popup
              closeButton={false}
              closeOnClick
              latitude={popover.coordinates.lat}
              longitude={popover.coordinates.lng}
              onClose={() => {
                setPopover(null)
              }}
            >
              <h3>{popover.entity.label}</h3>
            </Popup>
          ) : null}
        </GeoMap>
        <FilterControlsPanel name={formId}>
          <MultiComboBox
            getColor={() => {
              return personsLayerStyle.paint['circle-color']
            }}
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
        </FilterControlsPanel>
      </MainContent>
    </Fragment>
  )
}
