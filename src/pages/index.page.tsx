import 'rsuite/dist/rsuite.min.css'

import { Listbox, Transition } from '@headlessui/react'
import { PageMetadata } from '@stefanprobst/next-page-metadata'
import type { Feature, FeatureCollection } from 'geojson'
import * as _ from 'lodash'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Layer, Popup, Source, useMap } from 'react-map-gl'
import { RangeSlider } from 'rsuite'

import { useI18n } from '@/app/i18n/use-i18n'
import { withDictionaries } from '@/app/i18n/with-dictionaries'
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template'
import { controlPanelStyle } from '@/components/control-panel.config'
import { GeoMap } from '@/components/geo-map'
import { initialViewState, mapStyle } from '@/components/geo-map.config'
import { clusterCountLayer, clusterLayer, unclusteredPointLayer } from '@/components/layers'
import { clearSpiderifiedCluster, spiderifyCluster } from '@/components/spiderifier.ts'
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
        During the last ten years the members of the interdisciplinary commission the North Atlantic
        Triangle have explored the close transatlantic links between Europeans and North Americans
        and the exchange of people and ideas in the 19th, 20th and 21st centuries. They have in
        particular documented the networks established especially in the years between the two World
        Wars in a number of volumes, and have underlined the importance of these relationships for
        the refugees from Nazi Germany, including Austria after the Anschluss; who sought a safe
        haven in the USA. In the initial phase of establishing the database the ties of friendship
        between several of the many American foreign correspondents simultaneously stationed in
        Vienna (!) and a number of visiting writers (as well as numerous physicians attending
        courses arranged by the American Medical Association in Vienna) on the one hand, and members
        of the Austrian social and cultural elite, on the other, are highlighted, and the fact that
        the proximity of their residences in Vienna facilitated contacts and interaction is
        demonstrated. These networks later – through affidavits supplied by American friends ¬
        facilitated the search for safety in North America, where the refugees found support and
        employment, especially close to the Atlantic and the Pacific coasts – particularly in
        academic fields, and in the realms of music and the theater. This fact is visualized with
        the help of the Geographic Information System. The database will also illustrate the
        fortunes and activities of the (relatively few) returnees among the emigrants, and show the
        effect and significance of the exchange of ideas across the North Atlantic, all so far
        documented in the ten volumes published by the commission since 2012. Search in the database
        will eventually permit interested users to identify key agents in the transatlantic cultural
        exchange, especially between the 1920s and 1960s. It will allow them to recognize the role
        of encounters in the biographies of scores of individuals in Central Europe and in the USA
        and Canada whose autobiographies and correspondence reflect these ties, and permit the users
        to note the stimulation of professional careers in the media, the arts and in academe by
        such contacts. It will also encourage the users to trace the impact of transatlantic
        interaction on the genesis of non-fictional and fictional texts, on plays and musical
        compositions, and on the evolution of (shared) philosophical and political ideas. It will
        also help to assess the consequences of such exchanges for the perception of the different
        societies and the development of their various institutions. The database will aid the users
        in their attempts to comprehend the historical shifts in the relationship between the
        countries of Europe and North America.
      </p>
    </div>
  )
}

function MainMap(): JSX.Element {
  const { persons, places, relationsByPlace, relationsByPerson } = usePersonsPlaces()
  const id = {
    source: 'places-data',
    layer: 'places',
  }

  const points1: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  }

  const data = useMemo(() => {
    let id_point = 1
    places.forEach((place) => {
      const relations: Array<Record<string, unknown>> = relationsByPlace.get(place.id)
      relations.forEach((relation: Record<string, unknown>) => {
        if (place.lat != null && place.lng != null) {
          const profession = persons.find((x) => {
            return x.id === relation['related_person']['id']
          }).profession[0]
          let profLabel = ''
          if (profession) {
            profLabel = profession.label
          }
          const point: Feature = {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [place.lng, place.lat] },
            id: id_point,
            properties: {
              id_place: place.id,
              place: place.name,
              id_person: relation['related_person']['id'],
              person: relation['related_person']['label'],
              relation: relation['relation_type']['label'],
              start: relation['start_date_written'],
              end: relation['end_date_written'],
              visibility: true,
              profession: profLabel,
              /** NOTE: Be aware that nested objects and arrays get stringified on `event.features`. */
            },
          }
          points1.features.push(point)
          id_point += 1
        }
      })
    })
    return points1
  }, [places])

  const relationTypes = useMemo(() => {
    const types: Array<string> = []
    places.forEach((place) => {
      const relations: Record<string, unknown> = relationsByPlace.get(place.id)
      relations.forEach((relation) => {
        if (!types.includes(relation.relation_type.label)) {
          types.push(relation.relation_type.label)
        }
      })
    })
    return types
  }, [places])

  const professionTypes = useMemo(() => {
    const types: Array<string> = []
    persons.forEach((person) => {
      const professions = person.profession
      professions.forEach((profession) => {
        if (!types.includes(profession.label)) {
          types.push(profession.label)
        }
      })
    })
    return types
  }, [persons])

  let timeRange: Array<number> = [1920, 1960]
  const filters: Record<Array<string>> = {
    'Place relations': relationTypes,
    Professions: professionTypes,
  }

  const filterList = JSON.parse(JSON.stringify(filters))

  function timeRangeChange(e) {
    timeRange = e
  }

  function relationChange(type: string, value: Array<string>) {
    filters[type] = value
    togglePoints(mapRef.current)
  }

  function togglePoints(map) {
    const timeRangeCopy: Array<number> = [...timeRange]
    const points: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    }

    if (timeRange[0] === 1920) {
      timeRangeCopy[0] = 0
    }
    if (timeRange[1] === 1960) {
      timeRangeCopy[1] = 2000
    }
    data.features.forEach((point) => {
      if (!filters) {
        point.properties['visibility'] = false
      } else {
        let relationFilter = false
        let timeFilter = false
        let professionFilter = false
        if (filters['Place relations'].includes(point.properties.relation)) {
          relationFilter = true
        }
        if (filters['Professions'].includes(point.properties.profession)) {
          professionFilter = true
        }
        const dates: Array<string> = []
        if (point.properties.start !== null) dates.push(point.properties.start.substring(0, 4))
        if (point.properties.end !== null) dates.push(point.properties.end.substring(0, 4))
        if (dates.length === 0) {
          timeFilter = true
        } else if (dates.length === 1) {
          if (dates[0] >= timeRangeCopy[0] && dates[0] <= timeRangeCopy[1]) {
            timeFilter = true
          }
        } else if (dates.length === 2) {
          if (
            (dates[0] >= timeRangeCopy[0] && dates[0] <= timeRangeCopy[1]) ||
            (dates[1] >= timeRangeCopy[0] && dates[1] <= timeRangeCopy[1])
          ) {
            timeFilter = true
          }
        }
        if (filters === relationTypes && timeRange === [1920, 1960]) {
          point.properties['visibility'] = true
        } else if (filters === undefined) {
          point.properties['visibility'] = false
        } else {
          if (timeFilter === true && relationFilter === true && professionFilter === true) {
            point.properties['visibility'] = true
            points.features.push(point)
          } else {
            point.properties['visibility'] = false
          }
        }
      }
    })
    map.getSource('places-data').setData(points)
    clearSpiderifiedCluster(mapRef.current)
    map.triggerRepaint()
  }
  const mapRef = useRef<MapRef>(null)

  function mouseClick(e) {
    const features = mapRef.current.queryRenderedFeatures(e.point, {
      layers: ['clusters'],
    })
    if (features.length > 0) {
      const clusterId = features[0].properties.cluster_id

      // Zoom on cluster or spiderify it
      if (mapRef.current.getZoom() < 12) {
        mapRef.current.getSource('places-data').getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return
          mapRef.current.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          })
        })
      } else {
        const spiderifiedCluster = {
          id: clusterId,
          coordinates: features[0].geometry.coordinates,
        }
        spiderifyCluster({
          map: mapRef.current,
          source: 'places-data',
          clusterToSpiderify: spiderifiedCluster,
        })
      }
    }
  }

  const onMapLoad = useCallback(() => {
    mapRef.current.getMap().on('click', 'clusters', function (e) {
      clearSpiderifiedCluster(mapRef.current)
    })
    mapRef.current.getMap().on('zoom', function (e) {
      clearSpiderifiedCluster(mapRef.current)
    })
  })

  return (
    <GeoMap
      initialViewState={initialViewState}
      mapStyle={mapStyle.positron}
      ref={mapRef}
      interactiveLayerIds={[clusterLayer.id, unclusteredPointLayer.id]}
      onClick={mouseClick}
      clickRadius={2}
      onLoad={onMapLoad}
      maxZoom={16}
    >
      <PlacesLayer relationsByPlace={relationsByPlace} id={id} data={data} />
      <ControlPanel
        relationTypes={relationTypes}
        professionTypes={professionTypes}
        filterList={filterList}
        relationChange={(type, value) => {
          return relationChange(type, value)
        }}
        togglePoints={(map) => {
          return togglePoints(map)
        }}
      />
      <TimeSlider
        timeRangeChange={(e) => {
          return timeRangeChange(e)
        }}
        togglePoints={(map) => {
          return togglePoints(map)
        }}
      />
    </GeoMap>
  )
}

function PlacesLayer({ relationsByPlace, id, data }): JSX.Element {
  const popover = usePopoverState()
  const { show, hide } = popover

  function generatePopupContent(event) {
    if (event.features == null) return
    const [feature] = event.features
    if (feature == null || feature.geometry.type !== 'Point' || feature.properties == null) return

    const label = feature.properties['place']
    const link = `https://ica.acdh-dev.oeaw.ac.at/apis/entities/entity/place/${feature.properties.id_place}/detail`
    const text = [
      feature.properties['person'],
      feature.properties['relation'],
      [feature.properties['start'], feature.properties['end']].filter(Boolean).join('-'),
    ]
      .filter(Boolean)
      .join('. ')
    const persLink = `https://ica.acdh-dev.oeaw.ac.at/apis/entities/entity/person/${feature.properties['id_person']}/detail`
    const content = (
      <div className="grid gap-2 font-sans text-xs leading-4 text-gray-800">
        <a href={link} target="_blank" rel="noreferrer">
          <strong className="font-medium">{label}</strong>
        </a>
        <ul className="grid gap-1">
          <li key={feature.properties['id_person']}>
            <a href={persLink} target="_blank" rel="noreferrer">
              {text}
            </a>
          </li>
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
  }

  const { current: map } = useMap()
  useEffect(() => {
    if (map == null) return

    map.on('click', 'unclustered-point', (event) => {
      generatePopupContent(event)
    })
    map.on('click', 'spider-leaves', (event) => {
      generatePopupContent(event)
    })

    map.on('zoom', (event) => {
      hide()
    })

    map.on('mouseenter', id.layer, () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', id.layer, () => {
      map.getCanvas().style.cursor = ''
    })
  }, [map, id.layer, show, relationsByPlace])

  return (
    <Source
      id={'places-data'}
      type="geojson"
      data={data}
      cluster={true}
      clusterMaxZoom={25}
      clusterRadius={35}
    >
      <Layer {...clusterLayer} />
      <Layer {...clusterCountLayer} />
      <Layer {...unclusteredPointLayer} />
      {popover.isVisible ? (
        <Popup {...popover.coordinates} closeButton={false} onClose={hide}>
          {popover.content}
        </Popup>
      ) : null}
    </Source>
  )
}

interface ControlProps {
  relationTypes: Array<string>
  professionTypes: Array<string>
  filterList
  relationChange: (value: Array<string>) => void
  togglePoints: (map) => void
}

function ControlPanel(props: ControlProps): JSX.Element {
  const { current: map } = useMap()

  function toggleBasemap(value: string) {
    map?.getMap().setStyle(mapStyle[value])
  }

  const [selectedBasemap, setSelectedBasemap] = useState('positron')

  return (
    <div style={controlPanelStyle.panelStyle}>
      <h3>Basemaps: </h3>
      {Object.keys(mapStyle).map((basemap) => {
        return (
          <div key={basemap} className="input">
            <input
              type="radio"
              value={basemap}
              checked={selectedBasemap === basemap}
              onChange={(e) => {
                setSelectedBasemap(e.target.value)
                toggleBasemap(e.target.value)
              }}
            />
            <label> {basemap}</label>
          </div>
        )
      })}
      <h3>Filters </h3>
      {Object.keys(props.filterList).map((filter) => {
        return (
          <ListboxMultiple
            key={filter}
            filterOptions={props.filterList[filter]}
            type={filter}
            relationChange={(type, value) => {
              return props.relationChange(type, value)
            }}
          />
        )
      })}
    </div>
  )
}

function TimeSlider(props: TimeProps): JSX.Element {
  const { current: map } = useMap()

  return (
    <RangeSlider
      style={{ top: '75%', left: '25%', width: '50%' }}
      min={1920}
      step={5}
      max={1960}
      defaultValue={[1920, 1960]}
      graduated
      onChangeCommitted={(e) => {
        props.timeRangeChange(e)
        props.togglePoints(map)
      }}
    />
  )
}

function ListboxMultiple(props: ListboxProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)

  const [selectedOptions, setselectedOptions] = useState(props.filterOptions)

  function isSelected(value) {
    return selectedOptions.find((el) => {
      return el === value
    })
      ? true
      : false
  }
  function handleSelect(value) {
    if (!isSelected(value)) {
      const selectedOptionsUpdated = [
        ...selectedOptions,
        props.filterOptions.find((el) => {
          return el === value
        }),
      ]
      setselectedOptions(selectedOptionsUpdated)
      props.relationChange(props.type, selectedOptionsUpdated)
      setChecked(true)
    } else {
      handleDeselect(value)
    }
    setIsOpen(true)
  }

  function handleDeselect(value) {
    const selectedOptionsUpdated = selectedOptions.filter((el) => {
      return el !== value
    })
    setselectedOptions(selectedOptionsUpdated)
    props.relationChange(props.type, selectedOptionsUpdated)
    setIsOpen(true)
    if (selectedOptionsUpdated.length === 0) {
      setChecked(false)
    }
  }

  function handleChecked(checked) {
    if (checked) {
      setselectedOptions(props.filterOptions)
      props.relationChange(props.type, props.filterOptions)
    } else if (!checked) {
      setselectedOptions([])
      props.relationChange(props.type, [])
    }
  }

  const [checked, setChecked] = useState(true)

  return (
    <Listbox
      as="div"
      className="space-y-1"
      value={selectedOptions}
      onChange={(value) => {
        handleSelect(value)
      }}
      open={isOpen}
    >
      {() => {
        return (
          <>
            <input
              type="checkbox"
              id={props.type}
              className="inline"
              checked={checked}
              onChange={(e) => {
                setChecked(!checked)
                handleChecked(e.target.checked)
              }}
            />
            <Listbox.Label
              className="block inline text-sm font-medium leading-5 text-gray-700"
              for={props.type}
            >
              {props.type}
            </Listbox.Label>
            <div className="relative">
              <span className="inline-block w-full rounded-md shadow-sm">
                <Listbox.Button
                  className="focus:shadow-outline-blue relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left transition duration-150 ease-in-out focus:border-blue-300 focus:outline-none sm:text-sm sm:leading-5"
                  onClick={() => {
                    return setIsOpen(!isOpen)
                  }}
                  open={isOpen}
                >
                  <span className="block truncate">
                    {selectedOptions.length < 1
                      ? 'Select filters'
                      : `Selected ${props.type} (${selectedOptions.length})`}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Listbox.Button>
              </span>

              <Transition
                unmount={false}
                show={isOpen}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="absolute mt-1 w-full rounded-md bg-white shadow-lg"
              >
                <Listbox.Options
                  static
                  className="shadow-xs max-h-60 overflow-auto rounded-md py-1 text-base leading-6 focus:outline-none sm:text-sm sm:leading-5"
                >
                  {props.filterOptions.map((option) => {
                    const selected = isSelected(option)
                    return (
                      <Listbox.Option key={option} value={option}>
                        {({ active }) => {
                          return (
                            <div
                              className={`${
                                active ? 'bg-blue-600 text-white' : 'text-gray-900'
                              } relative cursor-default select-none py-2 pl-8 pr-4`}
                            >
                              <span
                                className={`${
                                  selected ? 'font-semibold' : 'font-normal'
                                } block truncate`}
                              >
                                {option}
                              </span>
                              {selected && (
                                <span
                                  className={`${
                                    active ? 'text-white' : 'text-blue-600'
                                  } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                                >
                                  <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              )}
                            </div>
                          )
                        }}
                      </Listbox.Option>
                    )
                  })}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )
      }}
    </Listbox>
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
