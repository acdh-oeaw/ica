import 'rsuite/dist/rsuite.min.css'

import { Combobox, Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
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
import {
  clusterCountLayer,
  clusterLayer,
  lineStyle,
  unclusteredPointLayer,
} from '@/components/layers'
import { clearSpiderifiedCluster, spiderifyCluster } from '@/components/spiderifier'
import { usePersonsPersons } from '@/lib/use-persons-persons'
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
        <h1 className="text-center text-5xl font-extrabold">Ideas Crossing the Atlantic</h1>
        <h2 className="text-center text-2xl font-bold">
          A Geovisualization of Transatlantic Networks and Emigration (from Central Europe)
        </h2>
      </div>
      <p className="text-justify text-lg leading-relaxed">
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
        documented in the ten volumes published by the commission since 2012.
        <br />
        Search in the database will eventually permit interested users to identify key agents in the
        transatlantic cultural exchange, especially between the 1920s and 1960s. It will allow them
        to recognize the role of encounters in the biographies of scores of individuals in Central
        Europe and in the USA and Canada whose autobiographies and correspondence reflect these
        ties, and permit the users to note the stimulation of professional careers in the media, the
        arts and in academe by such contacts. It will also encourage the users to trace the impact
        of transatlantic interaction on the genesis of non-fictional and fictional texts, on plays
        and musical compositions, and on the evolution of (shared) philosophical and political
        ideas. It will also help to assess the consequences of such exchanges for the perception of
        the different societies and the development of their various institutions. The database will
        aid the users in their attempts to comprehend the historical shifts in the relationship
        between the countries of Europe and North America.
      </p>
    </div>
  )
}

function MainMap(): JSX.Element {
  const { persons, places, relationsByPlace, relationsByPerson } = usePersonsPlaces()
  const { relationsByPersonA } = usePersonsPersons()

  const id = {
    source: 'places-data',
    layer: 'places',
  }

  const points1: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  }

  let id_feature = 1
  const data = useMemo(() => {
    places.forEach((place) => {
      const relations: Array<Record<string, unknown>> = relationsByPlace.get(place.id)
      if (relations) {
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
              id: id_feature,
              properties: {
                id_place: place.id,
                place: place.name,
                id_person: relation['related_person']['id'],
                id_relation: relation['id'],
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
            id_feature += 1
          }
        })
      }
    })
    return points1
  }, [places])

  const lines: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  }

  const linesData = useMemo(() => {
    persons.forEach((person) => {
      const relationsPersA = relationsByPersonA.get(person.id)
      const relationsPlace = relationsByPerson.get(person.id)
      const lived = ['lived in', 'lived at']
      if (relationsPersA) {
        if (relationsPlace) {
          const personPlaceA = relationsByPerson.get(person.id).find((item) => {
            return lived.includes(item.relation_type.label)
          })
          if (personPlaceA) {
            const placeA = places.find((item) => {
              return item.id === personPlaceA.related_place.id
            })
            if (placeA) {
              relationsPersA.forEach((relation) => {
                const line: Feature = {
                  type: 'Feature',
                  id: id_feature,
                  geometry: { type: 'LineString', coordinates: [[placeA.lng, placeA.lat]] },
                  properties: {
                    personA: relation['related_personA']['label'],
                    id_personA: relation['related_personA']['id'],
                    personB: relation['related_personB']['label'],
                    id_personB: relation['related_personB']['id'],
                    id_relation: relation['id'],
                    id_places: [placeA.id],
                    type: relation['relation_type']['label'],
                    start: relation['start_date_written'],
                    end: relation['end_date_written'],
                    visibility: true,
                  },
                }

                const relationsPersB = relationsByPerson.get(relation.related_personB.id)
                if (relationsPersB) {
                  const personPlaceB = relationsByPerson
                    .get(relation.related_personB.id)
                    .find((item) => {
                      return lived.includes(item.relation_type.label)
                    })
                  if (personPlaceB) {
                    const placeB = places.find((item) => {
                      return item.id === personPlaceB.related_place.id
                    })
                    if (placeB) {
                      line.geometry.coordinates.push([placeB.lng, placeB.lat])
                      line.properties.id_places.push(placeB.id)
                      lines.features.push(line)
                      id_feature += 1
                    }
                  }
                }
              })
            }
          }
        }
      }
    })
    return lines
  }, [places])

  const personRelationTypes: Array<string> = useMemo(() => {
    const types: Array<string> = []
    persons.forEach((person) => {
      const relationsPers = relationsByPersonA.get(person.id)
      if (relationsPers) {
        relationsPers.forEach((relation) => {
          if (!types.includes(relation.relation_type.label)) {
            types.push(relation.relation_type.label)
          }
        })
      }
    })
    return types
  }, [persons, relationsByPersonA])

  const placeRelationTypes = useMemo(() => {
    const types: Array<string> = []
    places.forEach((place) => {
      const relations: Record<string, unknown> = relationsByPlace.get(place.id)
      if (relations) {
        relations.forEach((relation) => {
          if (!types.includes(relation.relation_type.label)) {
            types.push(relation.relation_type.label)
          }
        })
      }
    })
    return types
  }, [places, relationsByPlace])

  const persProf: Record<string, Array<string>> = useMemo(() => {
    const nameArray: Array<string> = []
    const profArray: Array<string> = []
    persons.forEach((person) => {
      const name = `${person.name}, ${person.first_name}`
      if (!nameArray.includes(name)) {
        nameArray.push(name)
      }
      const professions = person.profession
      professions.forEach((profession) => {
        if (!profArray.includes(profession.label)) {
          profArray.push(profession.label)
        }
      })
    })
    const types = {
      Professions: profArray,
      Persons: nameArray,
    }
    return types
  }, [persons])

  let timeRange: Array<number> = [1920, 1960]
  const filters: Record<string, Array<string>> = {
    'Place relations': placeRelationTypes,
    'Person relations': personRelationTypes,
    Professions: persProf['Professions'],
  }

  const filterList = JSON.parse(JSON.stringify(filters))

  filters['Persons'] = persProf['Persons']

  function timeRangeChange(e) {
    timeRange = e
  }

  function relationChange(type: string, value: Array<string>) {
    filters[type] = value
    const pointTypes = ['Place relations', 'Professions', 'Persons']
    if (pointTypes.includes(type)) {
      togglePoints(mapRef.current)
    } else if (type === 'Person relations') {
      toggleLines(mapRef.current)
    } else {
      togglePoints(mapRef.current)
      toggleLines(mapRef.current)
    }
  }

  function checkDates(start: string, end: string) {
    const timeRangeCopy: Array<number> = [...timeRange]
    if (timeRange[0] === 1920) {
      timeRangeCopy[0] = 0
    }
    if (timeRange[1] === 1960) {
      timeRangeCopy[1] = 2000
    }
    const dates: Array<string> = []
    if (start !== null) dates.push(start.substring(0, 4))
    if (end !== null) dates.push(end.substring(0, 4))
    if (dates.length === 0) {
      return true
    } else if (dates.length === 1) {
      if (dates[0] >= timeRangeCopy[0] && dates[0] <= timeRangeCopy[1]) {
        return true
      }
    } else if (dates.length === 2) {
      if (
        (dates[0] >= timeRangeCopy[0] && dates[0] <= timeRangeCopy[1]) ||
        (dates[1] >= timeRangeCopy[0] && dates[1] <= timeRangeCopy[1])
      ) {
        return true
      }
    }
  }

  function togglePoints(map) {
    const points: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    }
    const lines: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    }
    const pointsDis = new Set()
    data.features.forEach((point) => {
      if (!filters) {
        point.properties['visibility'] = false
      } else {
        let relationFilter = false
        let timeFilter = false
        let professionFilter = false
        let personFilter = false
        if (filters['Place relations'].includes(point.properties.relation)) {
          relationFilter = true
        }
        if (filters['Professions'].includes(point.properties.profession)) {
          professionFilter = true
        }
        if (filters['Persons'].includes(point.properties.person)) {
          personFilter = true
        }
        timeFilter = checkDates(point.properties.start, point.properties.end)
        if (filters === placeRelationTypes && timeRange === [1920, 1960]) {
          point.properties['visibility'] = true
        } else if (filters === undefined) {
          point.properties['visibility'] = false
        } else {
          if (
            timeFilter === true &&
            relationFilter === true &&
            professionFilter === true &&
            personFilter === true
          ) {
            point.properties['visibility'] = true
            points.features.push(point)
            toggleLines(map)
          } else {
            point.properties['visibility'] = false
            pointsDis.add(point.properties.id_place)
          }
        }
      }
    })
    linesData.features.forEach((line) => {
      let counterPointsDis = 0
      line.properties.id_places.forEach((id_place) => {
        if (pointsDis.has(id_place)) {
          counterPointsDis += 1
        }
      })
      if (counterPointsDis >= 2) {
        line.properties['visibility'] = false
      }
      lines.features.push(line)
    })
    map.getSource('places-data').setData(points)
    map.getSource('lines-data').setData(lines)
    clearSpiderifiedCluster(mapRef.current)
    map.triggerRepaint()
  }

  function toggleLines(map) {
    const lines: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    }
    linesData.features.forEach((line) => {
      if (!filters) {
        line.properties['visibility'] = false
      } else {
        let relationFilter = false
        let timeFilter = false
        if (filters['Person relations'].includes(line.properties.type)) {
          relationFilter = true
        }
        timeFilter = checkDates(line.properties.start, line.properties.end)
        if (filters === personRelationTypes && timeRange === [1920, 1960]) {
          line.properties['visibility'] = true
        } else if (filters === undefined) {
          line.properties['visibility'] = false
        } else {
          if (timeFilter === true && relationFilter === true) {
            line.properties['visibility'] = true
            lines.features.push(line)
          } else {
            line.properties['visibility'] = false
          }
        }
      }
    })
    map.getSource('lines-data').setData(lines)
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

  const popover = usePopoverState()
  const { show, hide } = popover

  function generatePopupContent(event) {
    if (event.features == null) return
    const features = [...event.features]
    let label = ''
    let link = ''
    let text = ''
    let persLink = ''
    const content = []
    let type = ''
    features.forEach((feature) => {
      if (feature == null || feature.properties == null) return
      console.log(feature)
      type = feature.geometry.type
      if (type === 'Point') {
        label = feature.properties['place']
        link = `https://ica.acdh-dev.oeaw.ac.at/apis/entities/entity/place/${feature.properties.id_place}/detail`
        text = [
          feature.properties['person'],
          feature.properties['relation'],
          [feature.properties['start'], feature.properties['end']].filter(Boolean).join('-'),
        ]
          .filter(Boolean)
          .join('. ')
        persLink = `https://ica.acdh-dev.oeaw.ac.at/apis/entities/entity/person/${feature.properties['id_person']}/detail`
      } else if (type === 'LineString') {
        label = feature.properties['personA']
        link = `https://ica.acdh-dev.oeaw.ac.at/apis/entities/entity/person/${feature.properties.id_personA}/detail`
        text = [
          feature.properties['type'],
          feature.properties['personB'],
          [feature.properties['start'], feature.properties['end']].filter(Boolean).join('-'),
        ]
          .filter(Boolean)
          .join('. ')
        persLink = `https://ica.acdh-dev.oeaw.ac.at/apis/entities/entity/person/${feature.properties['id_personB']}/detail`
      }
      const contentPart = (
        <div className="grid gap-2 font-sans text-xs leading-4 text-gray-800" key={feature['id']}>
          <a href={link} target="_blank" rel="noreferrer">
            <strong className="font-medium">{label}</strong>
          </a>
          <ul className="grid gap-1">
            <li>
              <a href={persLink} target="_blank" rel="noreferrer">
                {text}
              </a>
            </li>
          </ul>
        </div>
      )
      content.push(contentPart)
    })
    const contentToShow = <div> {content} </div>
    let longitude = null
    let latitude = null
    if (type === 'Point') {
      ;[longitude, latitude] = features[0].geometry.coordinates.slice()
    } else if (type === 'LineString') {
      longitude = event.lngLat.lng
      latitude = event.lngLat.lat
    }
    if (longitude == null || latitude == null) return
    /**
     * Ensure that if the map is zoomed out such that multiple copies of the feature are visible,
     * the popup appears over the copy being pointed to.
     */
    while (Math.abs(event.lngLat.lng - longitude) > 180) {
      longitude += event.lngLat.lng > longitude ? 360 : -360
    }
    show({ longitude, latitude }, contentToShow)
  }

  return (
    <GeoMap
      initialViewState={initialViewState}
      mapStyle={mapStyle.positron}
      ref={mapRef}
      interactiveLayerIds={[clusterLayer.id, unclusteredPointLayer.id, lineStyle.id]}
      onClick={mouseClick}
      clickRadius={3}
      onLoad={onMapLoad}
      maxZoom={16}
    >
      <LayerCollection
        relationsByPlace={relationsByPlace}
        id={id}
        data={data}
        linesData={linesData}
        generatePopupContent={(event) => {
          return generatePopupContent(event)
        }}
      />
      {popover.isVisible ? (
        <Popup {...popover.coordinates} closeButton={false} onClose={hide}>
          {popover.content}
        </Popup>
      ) : null}
      <ControlPanel
        filterList={filterList}
        personList={persProf['Persons']}
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

interface LayerProps {
  relationsByPlace
  id
  data
  linesData
  generatePopupContent: (event) => void
}

function LayerCollection(props: LayerProps): JSX.Element {
  const popover = usePopoverState()
  const { show, hide } = popover

  const { current: map } = useMap()
  useEffect(() => {
    if (map == null) return

    map.on('click', 'unclustered-point', (event) => {
      props.generatePopupContent(event)
    })
    map.on('click', 'spider-leaves', (event) => {
      props.generatePopupContent(event)
    })
    map.on('click', 'clusters', (event) => {
      event.preventDefault()
    })

    map.on('click', 'lines', (event) => {
      props.generatePopupContent(event)
    })

    map.on('zoom', (event) => {
      hide()
    })

    map.on('mouseenter', props.id.layer, () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', props.id.layer, () => {
      map.getCanvas().style.cursor = ''
    })
  }, [map, props.id.layer, show, props.relationsByPlace])

  return (
    <>
      <Source id="lines-data" type="geojson" data={props.linesData}>
        <Layer {...lineStyle} />
      </Source>
      <Source
        id={'places-data'}
        type="geojson"
        data={props.data}
        cluster={true}
        clusterMaxZoom={25}
        clusterRadius={30}
      >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPointLayer} />
      </Source>
    </>
  )
}

interface ControlProps {
  filterList
  personList: Array<string>
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
      <ComboboxMultiple
        personList={props.personList}
        relationChange={(type, value) => {
          return props.relationChange(type, value)
        }}
      />
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

  const [options, setOptions] = useState([])
  const [selectedOptions, setselectedOptions] = useState([])

  useEffect(() => {
    if (props.filterOptions.length > 0) {
      setOptions(props.filterOptions)
      setselectedOptions(props.filterOptions)
    }
  }, [props.filterOptions])

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
        options.find((el) => {
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
      setselectedOptions(options)
      props.relationChange(props.type, options)
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
                className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg"
              >
                <Listbox.Options
                  static
                  className="shadow-xs max-h-60 overflow-auto rounded-md py-1 text-base leading-6 focus:outline-none sm:text-sm sm:leading-5"
                >
                  {options.map((option) => {
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

function ComboboxMultiple(props: ComboboxProps): JSX.Element {
  const [people, setPeople] = useState([])
  const [selectedPeople, setSelectedPeople] = useState([])

  useEffect(() => {
    if (props.personList.length > 0) {
      setPeople(props.personList)
      setSelectedPeople(props.personList)
    }
  }, [props.personList])

  const [query, setQuery] = useState('')

  const filteredPeople =
    query === ''
      ? people
      : people.filter((person) => {
          return person.toLowerCase().includes(query.toLowerCase())
        })

  function handleChange(e) {
    setSelectedPeople(e)
    props.relationChange('Persons', e)
  }

  function handleChecked(checked) {
    if (checked) {
      setSelectedPeople(people)
      props.relationChange('Persons', people)
    } else if (!checked) {
      setSelectedPeople([])
      props.relationChange('Persons', [])
    }
  }

  const [checked, setChecked] = useState(true)

  return (
    <>
      <input
        type="checkbox"
        id={'Persons'}
        className="inline"
        checked={checked}
        onChange={(e) => {
          setChecked(!checked)
          handleChecked(e.target.checked)
        }}
      />
      {'Persons'}
      <Combobox
        value={selectedPeople}
        onChange={(e) => {
          handleChange(e)
        }}
        multiple
      >
        <div className="relative mt-1">
          <div className="focus-visible:ring-opacity-75 relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              onChange={(event) => {
                return setQuery(event.target.value)
              }}
              displayValue={(people) => {
                return `Selected Persons (${people.length})`
              }}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => {
              return setQuery('')
            }}
          >
            <Combobox.Options className="ring-opacity-5 absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black focus:outline-none sm:text-sm">
              {filteredPeople.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredPeople.map((person) => {
                  return (
                    <Combobox.Option
                      key={person}
                      className={({ active }) => {
                        return `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-teal-600 text-white' : 'text-gray-900'
                        }`
                      }}
                      value={person}
                    >
                      {({ selected, active }) => {
                        return (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {person}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? 'text-white' : 'text-teal-600'
                                }`}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )
                      }}
                    </Combobox.Option>
                  )
                })
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </>
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
