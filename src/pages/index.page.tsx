import { PageMetadata } from '@stefanprobst/next-page-metadata'
import type { Feature, FeatureCollection } from 'geojson'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { Layer, Popup, Source, useMap } from 'react-map-gl'

import { useI18n } from '@/app/i18n/use-i18n'
import { withDictionaries } from '@/app/i18n/with-dictionaries'
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template'
import { controlPanelStyle } from '@/components/control-panel.config'
import { GeoMap } from '@/components/geo-map'
import { initialViewState, mapStyle } from '@/components/geo-map.config'
import { layerStyle } from '@/components/geo-map-layers.config'
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
        <div className="h-screen">
          <MainMap />
        </div>
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

function MainMap(): JSX.Element {
  const { places, relationsByPlace } = usePersonsPlaces()

  const id = {
    source: 'places-data',
    layer: 'places',
  }

  const points: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  }

  const data = useMemo(() => {
    places.forEach((place) => {
      const relations: Array<Record<string, unknown>> = relationsByPlace.get(place.id)
      const relationObj: Record<string, unknown> = {}
      relations.forEach((relation: Record<string, unknown>) => {
        const information = {
          id: relation['related_person']['id'],
          label: relation['related_person']['label'],
          start: relation['start_date_written'],
          end: relation['end_date_written'],
        }
        if (!Object.keys(relationObj).includes(relation['relation_type']['label'])) {
          relationObj[relation['relation_type']['label']] = [information]
        } else {
          relationObj[relation['relation_type']['label']].push(information)
        }
      })

      if (place.lat != null && place.lng != null) {
        const point: Feature = {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [place.lng, place.lat] },
          properties: {
            id: place.id,
            label: place.name,
            relations: relationObj,
            relationTypes: Object.keys(relationObj),
            visibility: true,
            /** NOTE: Be aware that nested objects and arrays get stringified on `event.features`. */
          },
        }
        points.features.push(point)
      }
    })
    return points
  }, [places])

  const relationTypes = useMemo(() => {
    const types = {}
    places.forEach((place) => {
      const relations: Record<string, unknown> = relationsByPlace.get(place.id)
      relations.forEach((relation) => {
        if (!Object.keys(types).includes(relation.relation_type.label)) {
          types[relation.relation_type.label] = 1
        } else {
          types[relation.relation_type.label] += 1
        }
      })
    })
    return types
  }, [places])

  const filters: Array<string> = []

  function toggleRelation(checked: boolean, value: string, map) {
    let index: number
    if (checked === false) {
      filters.push(value)
    } else {
      filters.forEach((filter) => {
        if (filter === value) {
          index = filters.indexOf(value)
          filters.splice(index, 1)
        }
      })
    }
    data.features.forEach((point) => {
      let counter = 0
      point.properties['relationTypes'].forEach((type: string) => {
        filters.forEach((filter) => {
          if (filter === type) {
            counter += 1
          }
        })
      })
      if (filters.length === 0) {
        point.properties['visibility'] = true
      } else {
        if (counter === point.properties['relationTypes'].length) {
          point.properties['visibility'] = false
        } else {
          point.properties['visibility'] = true
        }
      }
    })
    map.getSource('places-data').setData(data)
  }

  return (
    <GeoMap initialViewState={initialViewState} mapStyle={mapStyle.positron}>
      <PlacesLayer relationsByPlace={relationsByPlace} id={id} data={data} />
      <ControlPanel
        relationTypes={relationTypes}
        toggleRelation={(checked, value, map) => {
          return toggleRelation(checked, value, map)
        }}
      />
    </GeoMap>
  )
}

function PlacesLayer({ relationsByPlace, id, data }): JSX.Element {
  const popover = usePopoverState()
  const { show, hide } = popover

  const { current: map } = useMap()
  useEffect(() => {
    if (map == null) return

    map.on('click', id.layer, (event) => {
      if (event.features == null) return
      const [feature] = event.features
      if (feature == null || feature.geometry.type !== 'Point' || feature.properties == null) return

      const label = feature.properties['label']
      const relations = relationsByPlace.get(feature.properties['id'])
      const content = (
        <div className="grid gap-2 font-sans text-xs leading-4 text-gray-800">
          <strong className="font-medium">{label}</strong>
          <ul className="grid gap-1">
            {relations?.map((relation: Record<string, unknown>) => {
              const text = [
                relation['related_person']['label'],
                relation['relation_type']['label'],
                [relation['start_date_written'], relation['end_date_written']]
                  .filter(Boolean)
                  .join('-'),
              ]
                .filter(Boolean)
                .join('. ')
              return <li key={relation['id']}>{text}</li>
            })}
          </ul>
        </div>
      )

      // eslint-disable-next-line prefer-const
      let [longitude, latitude] = feature.geometry.coordinates.slice()
      if (longitude == null || latitude == null) return
      /**
       * Ensure that if the map is zoomed out such that multiple copies of the feature are visible,
       * the popup appears over the copy being pointed to.
       */
      while (Math.abs(event.lngLat.lng - longitude) > 180) {
        longitude += event.lngLat.lng > longitude ? 360 : -360
      }

      show({ longitude, latitude }, content)
    })

    map.on('mouseenter', id.layer, () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', id.layer, () => {
      map.getCanvas().style.cursor = ''
    })
  }, [map, id.layer, show, relationsByPlace])

  return (
    <Source id={id.source} type="geojson" data={data}>
      <Layer id={id.layer} {...layerStyle.circle} />
      {popover.isVisible ? (
        <Popup {...popover.coordinates} closeButton={false} onClose={hide}>
          {popover.content}
        </Popup>
      ) : null}
    </Source>
  )
}

interface ControlProps {
  relationTypes
  toggleRelation: (checked: boolean, value: string, map) => void
}

function ControlPanel(props: ControlProps): JSX.Element {
  const { current: map } = useMap()

  function onChangeVisibility(checked: boolean) {
    const visibility = checked ? 'visible' : 'none'
    map?.getMap().setLayoutProperty('places', 'visibility', visibility)
  }

  function toggleBasemap(value: string) {
    map?.getMap().setStyle(mapStyle[value])
  }

  const [selected, setSelected] = useState('positron')

  return (
    <div style={controlPanelStyle.panelStyle}>
      <h3>Layers: </h3>
      <label>
        <input
          type="checkbox"
          defaultChecked={true}
          onChange={(e) => {
            onChangeVisibility(e.target.checked)
          }}
        />
        <b> Places </b>
      </label>
      {Object.keys(props.relationTypes).map((type: string) => {
        return (
          <div key={type} className="input" style={{ marginLeft: '10px' }}>
            <label>
              <input
                type="checkbox"
                defaultChecked={true}
                value={type}
                onChange={(e) => {
                  props.toggleRelation(e.target.checked, e.target.value, map)
                }}
              />
              &nbsp;&quot;{type}&quot;: {props.relationTypes[type]}
            </label>
          </div>
        )
      })}
      <h3>Basemaps: </h3>
      {Object.keys(mapStyle).map((basemap) => {
        return (
          <div key={basemap} className="input">
            <input
              type="radio"
              value={basemap}
              checked={selected === basemap}
              onChange={(e) => {
                setSelected(e.target.value)
                toggleBasemap(e.target.value)
              }}
            />
            <label> {basemap}</label>
          </div>
        )
      })}
    </div>
  )
}

type PopoverState =
  | { isVisible: false }
  | { isVisible: true; coordinates: { longitude: number; latitude: number }; content: JSX.Element }

function usePopoverState() {
  const [popover, setPopover] = useState<PopoverState>({ isVisible: false })

  const show = useCallback(function show(
    coordinates: { longitude: number; latitude: number },
    content: JSX.Element,
  ) {
    setPopover({ isVisible: true, coordinates, content })
  },
  [])

  const hide = useCallback(function hide() {
    setPopover({ isVisible: false })
  }, [])

  return {
    ...popover,
    show,
    hide,
  }
}
