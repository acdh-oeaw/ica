import 'rsuite/dist/rsuite.min.css'

import { Combobox, Listbox, Switch, Transition } from '@headlessui/react'
import { ArrowsUpDownIcon as SelectorIcon, CheckIcon } from '@heroicons/react/20/solid'
import { PageMetadata } from '@stefanprobst/next-page-metadata'
import type { Feature, FeatureCollection, LineString, Point } from 'geojson'
import type { MapLayerMouseEvent } from 'maplibre-gl'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { MapboxMap, MapRef } from 'react-map-gl'
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
} from '@/components/geo-map-layer.config'
import { clearSpiderifiedCluster, spiderifyCluster } from '@/components/spiderifier'
import { useInstitutionPlaces } from '@/lib/use-institutions-places'
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
        documented in the ten volumes published by the commission since 2012.
      </p>
      <p className="text-lg leading-relaxed">
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

let id_feature = 1

function MainMap(): JSX.Element {
  const { persons, places, relationsByPlace, relationsByPerson } = usePersonsPlaces()

  const { personPersonRelationsBySourcePersonId, personPersonRelationsByTargetPersonId } =
    usePersonsPersons()

  const { relationsByPlaceInst } = useInstitutionPlaces()

  const mapRef = useRef<MapRef>(null)

  const id = useMemo(() => {
    return {
      source: 'places-data',
      layer: 'places',
    }
  }, [])

  // eslint-disable-next-line
  function buildPoint(personId: number, targetCollection: FeatureCollection, mainPerson: boolean) {
    const relationsPlace = relationsByPerson.get(personId)
    relationsPlace?.forEach((relation) => {
      const place = places.find((item) => {
        return item.id === relation.related_place.id
      })
      if (place) {
        if (place.lng !== null && place.lat !== null) {
          const point: Feature<Point> = {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [place.lng, place.lat] },
            id: relation.id,
            properties: {
              id_place: place.id,
              place: place.name,
              id_person: relation['related_person']['id'],
              person: relation['related_person']['label'],
              relation: relation['relation_type']['label'],
              start: relation['start_date_written'],
              end: relation['end_date_written'],
              startDate: relation['start_date'],
              endDate: relation['end_date'],
              visibility: true,
              mainPerson: mainPerson,
              /** NOTE: Be aware that nested objects and arrays get stringified on `event.features`. */
            },
          }
          targetCollection.features.push(point)
        }
      }
    })
  }

  const [mainPerson, setMainPerson] = useState<string>('')
  const [mainPersonId, setMainPersonId] = useState<number>(520)

  function changeMainPerson(person: string) {
    setMainPerson(person)
  }

  useEffect(() => {
    const lastName = mainPerson.split(', ')[0]
    const firstName = mainPerson.split(', ')[1]
    const personForId = persons.find((person) => {
      return person.first_name === firstName && person.name === lastName
    })
    if (personForId) {
      setMainPersonId(personForId.id)
    }
    if (mapRef.current) {
      // eslint-disable-next-line
      if (mapRef.current.getSource('places-data') !== undefined) {
        // @ts-expect-error Ignore for now
        mapRef.current.getSource('places-data').setData(pointsSinglePerson)
        // @ts-expect-error Ignore for now
        mapRef.current.getSource('lines-data').setData(linesSinglePerson)
      }
      clearSpiderifiedCluster(mapRef.current)
      mapRef.current.triggerRepaint()
    }
  }, [mainPerson])

  const pointsSinglePerson = useMemo(() => {
    const points: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    }

    buildPoint(mainPersonId, points, true)
    const relationsSource = personPersonRelationsBySourcePersonId.get(mainPersonId)
    relationsSource?.forEach((relation) => {
      buildPoint(relation.related_personB.id, points, false)
    })
    const relationsTarget = personPersonRelationsByTargetPersonId.get(mainPersonId)
    relationsTarget?.forEach((relation) => {
      buildPoint(relation.related_personA.id, points, false)
    })
    return points
  }, [
    buildPoint,
    personPersonRelationsBySourcePersonId,
    personPersonRelationsByTargetPersonId,
    mainPersonId,
  ])

  const linesSinglePerson = useMemo(() => {
    const lines: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    }

    const relationsPlace = relationsByPerson.get(mainPersonId)
    const relationsSource = personPersonRelationsBySourcePersonId.get(mainPersonId)
    const relationsTarget = personPersonRelationsByTargetPersonId.get(mainPersonId)
    const relationLists = [relationsSource, relationsTarget]

    relationLists.forEach((list) => {
      const lived = ['lived in', 'lived at']
      if (list) {
        if (relationsPlace) {
          const sourcePlaceRelation = relationsByPerson.get(mainPersonId)?.find((item) => {
            return lived.includes(item.relation_type.label)
          })
          if (sourcePlaceRelation) {
            const sourcePlace = places.find((item) => {
              return item.id === sourcePlaceRelation.related_place.id
            })
            if (sourcePlace) {
              const { lng, lat } = sourcePlace
              if (lng != null && lat != null) {
                list.forEach((relation) => {
                  const line: Feature<LineString> = {
                    type: 'Feature',
                    id: id_feature,
                    geometry: { type: 'LineString', coordinates: [[lng, lat]] },
                    properties: {
                      source: relation['related_personA']['label'],
                      id_source: relation['related_personA']['id'],
                      target: relation['related_personB']['label'],
                      id_target: relation['related_personB']['id'],
                      id_relation: relation['id'],
                      id_places: [sourcePlace.id],
                      type: relation['relation_type']['label'],
                      start: relation['start_date_written'],
                      end: relation['end_date_written'],
                      startDate: relation['start_date'],
                      endDate: relation['end_date'],
                      visibility: true,
                    },
                  }

                  const relationsTarget = relationsByPerson.get(relation.related_personB.id)
                  if (relationsTarget) {
                    const targetPlaceRelation = relationsByPerson
                      .get(relation.related_personB.id)
                      ?.find((item) => {
                        return lived.includes(item.relation_type.label)
                      })
                    if (targetPlaceRelation) {
                      const targetPlace = places.find((item) => {
                        return item.id === targetPlaceRelation.related_place.id
                      })
                      if (targetPlace) {
                        const { lng, lat } = targetPlace
                        if (lng != null && lat != null) {
                          line.geometry.coordinates.push([lng, lat])
                          line.properties?.['id_places'].push(targetPlace.id)
                          lines.features.push(line)
                          id_feature += 1
                        }
                      }
                    }
                  }
                })
              }
            }
          }
        }
      }
    })
    return lines
  }, [
    personPersonRelationsBySourcePersonId,
    personPersonRelationsByTargetPersonId,
    places,
    relationsByPerson,
    mainPersonId,
  ])

  const allPoints = useMemo(() => {
    const points: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    }
    places.forEach((place) => {
      const relationsInst = relationsByPlaceInst.get(place.id)
      const relationsPerson = relationsByPlace.get(place.id)
      let relations: Array<Record<string, any>> = []
      if (relationsInst) {
        relations = [...relationsInst]
      }
      if (relationsPerson) {
        relations = [...relations, ...relationsPerson]
      }
      relations.forEach((relation) => {
        if (place.lat != null && place.lng != null) {
          const point: Feature<Point> = {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [place.lng, place.lat] },
            // @ts-expect-error Ignore for now
            id: id,
            properties: {
              id_place: place.id,
              place: place.name,
              id_relation: relation['id'],
              relation: relation['relation_type']['label'],
              start: relation['start_date_written'],
              end: relation['end_date_written'],
              startDate: relation['start_date'],
              endDate: relation['end_date'],
              visibility: true,
              /** NOTE: Be aware that nested objects and arrays get stringified on `event.features`. */
            },
          }
          if (point.properties !== null) {
            if (relation['related_person'] !== undefined) {
              const profession = persons.find((x) => {
                return x.id === relation['related_person']['id']
              })?.profession[0]
              let profLabel = ''
              if (profession) {
                profLabel = profession.label
                point.properties['profession'] = profLabel
              }
              point.properties['id_person'] = relation['related_person']['id']
              point.properties['person'] = relation['related_person']['label']
              point.properties['type'] = 'person'
            } else if (relation['related_institution'] !== undefined) {
              point.properties['id_institution'] = relation['related_institution']['id']
              point.properties['institution'] = relation['related_institution']['label']
              point.properties['type'] = 'institution'
            }
          }
          points.features.push(point)
        }
      })
    })
    return points
  }, [places, persons, relationsByPlace, id, relationsByPlaceInst])


  const allLines = useMemo(() => {
    const lines: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    }

    persons.forEach((person) => {
      const relationsPlace = relationsByPerson.get(person.id)
      const relationsSource = personPersonRelationsBySourcePersonId.get(person.id)
      const relationsTarget = personPersonRelationsByTargetPersonId.get(person.id)
      const relationLists = [relationsSource, relationsTarget]
      relationLists.forEach((list) => {
        const lived = ['lived in', 'lived at']
        if (list) {
          if (relationsPlace) {
            const sourcePlaceRelation = relationsByPerson.get(person.id)?.find((item) => {
              return lived.includes(item.relation_type.label)
            })
            if (sourcePlaceRelation) {
              const sourcePlace = places.find((item) => {
                return item.id === sourcePlaceRelation.related_place.id
              })
              if (sourcePlace) {
                const { lng, lat } = sourcePlace
                if (lng != null && lat != null) {
                  list.forEach((relation) => {
                    const line: Feature<LineString> = {
                      type: 'Feature',
                      id: id_feature,
                      geometry: { type: 'LineString', coordinates: [[lng, lat]] },
                      properties: {
                        source: relation['related_personA']['label'],
                        id_source: relation['related_personA']['id'],
                        target: relation['related_personB']['label'],
                        id_target: relation['related_personB']['id'],
                        id_relation: relation['id'],
                        id_places: [sourcePlace.id],
                        type: relation['relation_type']['label'],
                        start: relation['start_date_written'],
                        end: relation['end_date_written'],
                        startDate: relation['start_date'],
                        endDate: relation['end_date'],
                        visibility: true,
                      },
                    }

                    const relationsTarget = relationsByPerson.get(relation.related_personB.id)
                    if (relationsTarget) {
                      const targetPlaceRelation = relationsByPerson
                        .get(relation.related_personB.id)
                        ?.find((item) => {
                          return lived.includes(item.relation_type.label)
                        })
                      if (targetPlaceRelation) {
                        const targetPlace = places.find((item) => {
                          return item.id === targetPlaceRelation.related_place.id
                        })
                        if (targetPlace) {
                          const { lng, lat } = targetPlace
                          if (lng != null && lat != null) {
                            line.geometry.coordinates.push([lng, lat])
                            line.properties?.['id_places'].push(targetPlace.id)
                            lines.features.push(line)
                            id_feature += 1
                          }
                        }
                      }
                    }
                  })
                }
              }
            }
          }
        }
      })
    })
    return lines
  }, [
    places,
    persons,
    personPersonRelationsBySourcePersonId,
    personPersonRelationsByTargetPersonId,
    relationsByPerson,
  ])

  const [pointsData, setPointsData] = useState(allPoints)
  const [linesData, setLinesData] = useState(allLines)

  function setSingleModeMap(onOff: boolean) {
    if (onOff === false) {
      setPointsData(allPoints)
      setLinesData(allLines)
    } else {
      setPointsData(pointsSinglePerson)
      setLinesData(linesSinglePerson)
    }
  }

  const personRelationTypes: Array<string> = useMemo(() => {
    const types: Array<string> = []
    persons.forEach((person) => {
      const relationsPers = personPersonRelationsBySourcePersonId.get(person.id)
      if (relationsPers) {
        relationsPers.forEach((relation) => {
          if (!types.includes(relation.relation_type.label)) {
            types.push(relation.relation_type.label)
          }
        })
      }
    })
    return types
  }, [persons, personPersonRelationsBySourcePersonId])

  const placeRelationTypes = useMemo(() => {
    const types: Array<string> = []
    places.forEach((place) => {
      const relations = relationsByPlace.get(place.id)
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

  const persProf = useMemo(() => {
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

  type filterCollection = {
    'Place relations': Array<string>
    'Person relations': Array<string>
    Professions: Array<string>
    Persons: Array<string>
  }

  const filterCollection: filterCollection = useMemo(() => {
    const filterObj = {
      'Place relations': placeRelationTypes,
      'Person relations': personRelationTypes,
      Professions: persProf['Professions'],
      Persons: persProf['Persons'],
    }
    return filterObj
  }, [persProf, personRelationTypes, placeRelationTypes])

  const [filters, setFilters] = useState<filterCollection>({
    'Place relations': [],
    'Person relations': [],
    Professions: [],
    Persons: [],
  })
  const [filterList, setFilterList] = useState<filterCollection>({
    'Place relations': [],
    'Person relations': [],
    Professions: [],
    Persons: [],
  })

  useEffect(() => {
    setFilters(JSON.parse(JSON.stringify(filterCollection)))
    setFilterList(JSON.parse(JSON.stringify(filterCollection)))
  }, [filterCollection])

  // @ts-expect-error Ignore for now
  delete filterList['Persons']

  const [timeRange, setTimeRange] = useState<[number, number]>([1920, 1960])

  function onTimeRangeChange(range: Array<number>) {
    setTimeRange(range as [number, number])
  }

  function relationChange(type: string, value: Array<string>) {
    setFilters((prevFilters) => {
      return {
        ...prevFilters,
        [type]: value,
      }
    })
  }

  useEffect(() => {
    if (mapRef.current !== null) {
      // @ts-expect-error Ignore for now
      onTogglePoints(mapRef.current)
    }
  }, [filters, timeRange])

  function checkDates(start: string, end: string) {
    const [_start, _end] = timeRange
    /** include everything before 1920 */
    const rangeStart = _start === 1920 ? 0 : _start
    /** include everything after 1960 */
    const rangeEnd = _end === 1960 ? 2000 : _end

    const dates: Array<number> = []
    if (start) dates.push(new Date(start).getUTCFullYear())
    if (end) dates.push(new Date(end).getUTCFullYear())

    if (dates.length === 0) {
      return true
    } else if (dates.length === 1) {
      const date = dates[0] as number
      if ((date as number) >= rangeStart && date <= rangeEnd) {
        return true
      }
    } else if (dates.length === 2) {
      const [start, end] = dates as [number, number]
      if ((start >= rangeStart && start <= rangeEnd) || (end >= rangeStart && end <= rangeEnd)) {
        return true
      }
    }

    return false
  }

  // This set helps with the toggling of relations lines when their start and end points are toggled, i.e. when there's no start or end point visible on the map.
  const [pointsList, setPointsList] = useState(new Set())

  function onTogglePoints(map: MapboxMap) {
    // declare Feature Collection for points
    const points: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    }

    // iterate through points in data set
    allPoints.features.forEach((point) => {
      // Define filter booleans for filter categories and check
      let [placeFilter, timeFilter, professionFilter, personFilter] = Array(4).fill(false)
      if (point.properties !== null) {
        if (point.properties['type'] === 'institution') {
          ;[placeFilter, timeFilter, professionFilter, personFilter] = Array(4).fill(true)
        }
        if (filters['Place relations'].includes(point.properties['relation'])) {
          placeFilter = true
        }
      }
      if (point.properties !== null) {
        if (filters['Professions'].includes(point.properties['profession'])) {
          professionFilter = true
        }
      }
      if (point.properties !== null) {
        if (filters['Persons'].includes(point.properties['person'])) {
          personFilter = true
        }
      }
      // @ts-expect-error Ignore for now
      timeFilter = checkDates(point.properties.start, point.properties.end)

      // Check what filters return
      if (
        timeFilter === true &&
        placeFilter === true &&
        professionFilter === true &&
        personFilter === true
      ) {
        // If all filters are true, set visibility to True and push point into feature collection
        // @ts-expect-error Ignore for now
        point.properties['visibility'] = true
        points.features.push(point)
        // Remove the visible point from the list of points which are not visible on the map
        setPointsList((prev) => {
          return new Set(
            // @ts-expect-error Ignore for now
            [...prev].filter((x) => {
              if (point.properties !== null) {
                return x !== point.properties['id_place']
              }
            }),
          )
        })
        toggleLines(map)
      } else {
        // @ts-expect-error Ignore for now
        point.properties['visibility'] = false
        // Add the now invisible point to the list of points which are not visible on the map
        if (point.properties !== null) {
          setPointsList((prev) => {
            // @ts-expect-error Ignore for now
            return new Set(prev.add(point.properties['id_place']))
          })
        }
      }
    })
    // eslint-disable-next-line
    if (map.getSource('places-data') !== undefined) {
      // @ts-expect-error Ignore for now
      map.getSource('places-data').setData(points)
    }
    clearSpiderifiedCluster(mapRef.current)
    map.triggerRepaint()
  }

  // toggle lines if the points visible on the map change
  useEffect(() => {
    if (mapRef.current !== null) {
      // @ts-expect-error Ignore for now
      toggleLines(mapRef.current)
    }
  }, [pointsList])

  function toggleLines(map: MapboxMap) {
    const lines: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    }
    // Same as with the points; define boolean to check for the different filters
    allLines.features.forEach((line) => {
      let pointFilter = false
      let placeFilter = false
      let timeFilter = false
      // This variable is used to check if both start and end point are invisible
      let counterPointsDis = 0
      // @ts-expect-error Ignore for now
      if (filters['Person relations'].includes(line.properties.type)) {
        placeFilter = true
      }
      // @ts-expect-error Ignore for now
      timeFilter = checkDates(line.properties['start'], line.properties['end'])
      // @ts-expect-error Ignore for now
      line.properties.id_places.forEach((id_place) => {
        if (pointsList.has(id_place)) {
          counterPointsDis += 1
        }
      })
      if (counterPointsDis < 2) {
        pointFilter = true
      }
      if (timeFilter === true && placeFilter === true && pointFilter === true) {
        // @ts-expect-error Ignore for now
        line.properties['visibility'] = true
        lines.features.push(line)
      } else {
        // @ts-expect-error Ignore for now
        line.properties['visibility'] = false
      }
    })
    // eslint-disable-next-line
    if (map.getSource('lines-data') !== undefined) {
      // @ts-expect-error Ignore for now
      map.getSource('lines-data').setData(lines)
    }
    map.triggerRepaint()
  }

  function onClick(event: MapLayerMouseEvent) {
    if (mapRef.current == null) return
    // @ts-expect-error Ignore for now
    const features = mapRef.current.queryRenderedFeatures(event.point, {
      layers: ['clusters'],
    })
    if (features.length > 0) {
      if (features[0] && features[0].properties !== null) {
        const clusterId = features[0].properties['cluster_id']

        // Zoom on cluster or spiderify it
        if (mapRef.current.getZoom() < 12) {
          mapRef.current
            .getSource('places-data')
            // @ts-expect-error Ignore for now
            .getClusterExpansionZoom(clusterId, (err: Error, zoom: number) => {
              // eslint-disable-next-line
              if (err) return
              if (mapRef.current) {
                mapRef.current.easeTo({
                  // @ts-expect-error Ignore for now
                  center: features[0].geometry.coordinates,
                  zoom: zoom,
                })
              }
            })
        } else {
          const spiderifiedCluster = {
            id: clusterId,
            // @ts-expect-error Ignore for now
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
  }

  const onMapLoad = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.getMap().on('click', 'clusters', function () {
        clearSpiderifiedCluster(mapRef.current)
      })
      mapRef.current.getMap().on('zoom', function () {
        clearSpiderifiedCluster(mapRef.current)
      })
    }
  }, [mapRef])

  const popover = usePopoverState()
  const { show, hide } = popover

  function generatePopupContent(event: { features: Array<Feature> | null; lngLat: any }) {
    if (event.features == null) return
    const features = [...event.features]
    let label = ''
    let link = ''
    let text = ''
    const content: Array<JSX.Element> = []
    let type = ''
    features.forEach((feature) => {
      if (feature.properties == null) return
      type = feature.geometry.type
      let persLink = ''
      if (type === 'Point') {
        label = feature.properties['place']
        link = `https://ica.acdh-dev.oeaw.ac.at/apis/entities/entity/place/${feature.properties['id_place']}/detail`
        const pointType = feature.properties['type']
        let featureLabel = ''
        if (pointType === 'person') {
          featureLabel = feature.properties['person']
          persLink = `https://ica.acdh-dev.oeaw.ac.at/apis/entities/entity/person/${feature.properties['id_person']}/detail`
        } else if (pointType === 'institution') {
          featureLabel = feature.properties['institution']
          persLink = `https://ica.acdh-dev.oeaw.ac.at/apis/entities/entity/institution/${feature.properties['id_institution']}/detail`
        }
        text = [
          featureLabel,
          feature.properties['relation'],
          [feature.properties['start'], feature.properties['end']].filter(Boolean).join('-'),
        ]
          .filter(Boolean)
          .join('. ')
      } else if (type === 'LineString') {
        label = feature.properties['source']
        link = `https://ica.acdh-dev.oeaw.ac.at/apis/entities/entity/person/${feature.properties['id_source']}/detail`
        text = [
          feature.properties['type'],
          feature.properties['target'],
          [feature.properties['start'], feature.properties['end']].filter(Boolean).join('-'),
        ]
          .filter(Boolean)
          .join('. ')
        persLink = `https://ica.acdh-dev.oeaw.ac.at/apis/entities/entity/person/${feature.properties['id_target']}/detail`
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
      const [feature] = features
      if (feature != null && feature.geometry.type === 'Point') {
        ;[longitude, latitude] = feature.geometry.coordinates.slice()
      }
    } else if (type === 'LineString') {
      longitude = event.lngLat!.lng
      latitude = event.lngLat!.lat
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
      // @ts-expect-error Ignore
      onClick={onClick}
      clickRadius={3}
      onLoad={onMapLoad}
      maxZoom={16}
    >
      <LayerCollection
        id={id}
        data={pointsData}
        linesData={linesData}
        generatePopupContent={generatePopupContent}
      />
      {popover.isVisible ? (
        <Popup {...popover.coordinates} closeButton={false} onClose={hide}>
          {popover.content}
        </Popup>
      ) : null}
      <ControlPanel
        // @ts-expect-error Ignore for now
        filterList={filterList}
        personList={persProf['Persons']}
        relationChange={relationChange}
        changeMainPerson={changeMainPerson}
        setSingleModeMap={setSingleModeMap}
      />
      <TimeSlider onTimeRangeChange={onTimeRangeChange} />
    </GeoMap>
  )
}

interface LayerProps {
  id: { source: string; layer: string }
  data: FeatureCollection
  linesData: FeatureCollection
  generatePopupContent: (event: any) => void
}

function LayerCollection(props: LayerProps): JSX.Element {
  const { id, generatePopupContent } = props

  const popover = usePopoverState()

  const { current: map } = useMap()

  useEffect(() => {
    if (map == null) return

    const { hide } = popover

    map.on('click', 'unclustered-point', (event) => {
      generatePopupContent(event)
    })
    map.on('click', 'spider-leaves', (event) => {
      generatePopupContent(event)
    })
    map.on('click', 'clusters', (event) => {
      event.preventDefault()
    })

    map.on('click', 'lines', (event) => {
      generatePopupContent(event)
    })

    map.on('zoom', () => {
      hide()
    })

    map.on('mouseenter', id.layer, () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', id.layer, () => {
      map.getCanvas().style.cursor = ''
    })
  }, [map, id.layer, popover, generatePopupContent])

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
        clusterRadius={15}
      >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPointLayer} />
      </Source>
    </>
  )
}

interface ControlProps {
  filterList: Array<string>
  personList: Array<string>
  relationChange: (type: string, value: Array<string>) => void
  changeMainPerson: (person: string) => void
  setSingleModeMap: (onOff: boolean) => void
}

function ControlPanel(props: ControlProps): JSX.Element {
  const { current: map } = useMap()

  function toggleBasemap(value: keyof typeof mapStyle) {
    map?.getMap().setStyle(mapStyle[value])
  }

  const [singlePersonMode, setSinglePersonMode] = useState(false)

  function setSinglePerson(onOff: boolean) {
    setSinglePersonMode(onOff)
    props.setSingleModeMap(onOff)
  }

  const [selectedBasemap, setSelectedBasemap] = useState<keyof typeof mapStyle>('positron')

  return (
    <div style={controlPanelStyle.panelStyle}>
      <ModeSwitch setSinglePerson={setSinglePerson} />
      <h3>Basemaps: </h3>
      {Object.keys(mapStyle).map((basemap) => {
        return (
          <div key={basemap} className="input">
            <input
              type="radio"
              value={basemap}
              checked={selectedBasemap === basemap}
              onChange={(event) => {
                const baseMap = event.target.value as keyof typeof mapStyle
                setSelectedBasemap(baseMap)
                toggleBasemap(baseMap)
              }}
            />
            <label> {basemap}</label>
          </div>
        )
      })}
      {!singlePersonMode && (
        <div>
          <h3>Filters </h3>
          {Object.keys(props.filterList).map((filter) => {
            return (
              <ListboxMultiple
                key={filter}
                // @ts-expect-error Check later
                filterOptions={props.filterList[filter]}
                type={filter}
                relationChange={props.relationChange}
              />
            )
          })}
          <ComboboxMultiple personList={props.personList} relationChange={props.relationChange} />
        </div>
      )}
      {singlePersonMode && (
        <ComboboxSingle personList={props.personList} changeMainPerson={props.changeMainPerson} />
      )}
    </div>
  )
}

interface TimeProps {
  onTimeRangeChange: (e: Array<number>) => void
}

function TimeSlider(props: TimeProps): JSX.Element {
  const { onTimeRangeChange } = props

  return (
    <RangeSlider
      style={{ top: '75%', left: '25%', width: '50%' }}
      min={1920}
      step={5}
      max={1960}
      defaultValue={[1920, 1960]}
      graduated
      onChangeCommitted={(e) => {
        onTimeRangeChange(e)
      }}
    />
  )
}

interface ListboxProps {
  filterOptions: Array<string>
  type: string
  relationChange: (type: string, value: Array<string>) => void
}

function ListboxMultiple(props: ListboxProps): JSX.Element {
  const { filterOptions, type, relationChange } = props

  const [options, setOptions] = useState<Array<string>>([])
  const [selectedOptions, setselectedOptions] = useState<Array<string>>([])

  useEffect(() => {
    if (filterOptions.length > 0) {
      setOptions(filterOptions)
      setselectedOptions(filterOptions)
    }
  }, [filterOptions])

  function isSelected(value: string) {
    return (
      selectedOptions.find((el) => {
        return el === value
      }) != null
    )
  }

  function handleSelect(event: Array<string>) {
    setselectedOptions(event)
    relationChange(type, event)
    event.length === 0 ? setChecked(false) : setChecked(true)
  }

  function handleChecked(checked: boolean) {
    const checkOptions = checked ? options : []
    setselectedOptions(checkOptions)
    relationChange(type, checkOptions)
  }

  const [checked, setChecked] = useState(true)

  return (
    <Listbox
      as="div"
      className="space-y-1"
      value={selectedOptions}
      multiple
      onChange={handleSelect}
    >
      {() => {
        return (
          <>
            <input
              type="checkbox"
              id={type}
              className="inline"
              checked={checked}
              onChange={(e) => {
                setChecked(!checked)
                handleChecked(e.target.checked)
              }}
            />
            <Listbox.Label
              className="block text-sm font-medium leading-5 text-gray-700"
              htmlFor={type}
            >
              {props.type}
            </Listbox.Label>
            <div className="relative">
              <span className="inline-block w-full rounded-md shadow-sm">
                <Listbox.Button className="focus:shadow-outline-blue relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left transition duration-150 ease-in-out focus:border-blue-300 focus:outline-none sm:text-sm sm:leading-5">
                  <span className="block truncate">
                    {selectedOptions.length < 1
                      ? 'Select filters'
                      : `Selected ${type} (${selectedOptions.length})`}
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

interface ComboboxProps {
  personList: Array<string>
  relationChange: (type: string, value: Array<string>) => void
}

export interface Ipeople {
  people: Array<string>
}

function ComboboxMultiple(props: ComboboxProps): JSX.Element {
  const { personList: people } = props

  const [selectedPeople, setSelectedPeople] = useState<Array<string>>([])

  useEffect(() => {
    if (people.length > 0) {
      setSelectedPeople(people)
    }
  }, [people])

  const [query, setQuery] = useState('')

  const filteredPeople: Array<string> =
    query === ''
      ? people
      : people.filter((person: string) => {
          return person.toLowerCase().includes(query.toLowerCase())
        })

  function handleChange(values: Array<string>) {
    setSelectedPeople(values)
    props.relationChange('Persons', values)
  }

  function handleChecked(checked: boolean) {
    if (checked) {
      setSelectedPeople(people)
      props.relationChange('Persons', people)
    } else {
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
      <Combobox value={selectedPeople} onChange={handleChange} multiple>
        <div className="relative mt-1">
          <div className="focus-visible:ring-opacity-75 relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              onChange={(event) => {
                setQuery(event.target.value)
              }}
              displayValue={(people: Array<string>) => {
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

interface ComboboxSingleProps {
  personList: Array<string>
  changeMainPerson: (person: string) => void
}

function ComboboxSingle(props: ComboboxSingleProps): JSX.Element {
  const { personList: people } = props

  const [selectedPerson, setSelectedPerson] = useState<string>('Gunther, John')

  useEffect(() => {
    if (people.length > 0) {
      props.changeMainPerson('Gunther, John')
    }
  }, [props])

  const [query, setQuery] = useState('')

  const filteredPeople: Array<string> =
    query === ''
      ? people
      : people.filter((person: string) => {
          return person.toLowerCase().includes(query.toLowerCase())
        })

  function handleChange(value: string) {
    setSelectedPerson(value)
    props.changeMainPerson(value)
  }

  return (
    <>
      <Combobox value={selectedPerson} onChange={handleChange}>
        <div className="relative mt-1">
          <div className="focus-visible:ring-opacity-75 relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              onChange={(event) => {
                setQuery(event.target.value)
              }}
              displayValue={(selectedPerson: string) => {
                return selectedPerson
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

interface ModeSwitchProps {
  setSinglePerson: (onOff: boolean) => void
}

function ModeSwitch(props: ModeSwitchProps): JSX.Element {
  const [enabled, setEnabled] = useState(false)

  function handleChange(e: boolean) {
    setEnabled(e)
    props.setSinglePerson(e)
  }

  return (
    <div>
      <Switch
        checked={enabled}
        onChange={handleChange}
        className={`${enabled ? 'bg-teal-900' : 'bg-teal-700'}
          focus-visible:ring-opacity-75 relative inline-flex h-[24px] w-[60px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none  focus-visible:ring-2 focus-visible:ring-white`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${enabled ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
      Single Person Mode
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
