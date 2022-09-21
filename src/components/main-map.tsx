import type { Feature, FeatureCollection, LineString, Point } from 'geojson'
import type { MapLayerMouseEvent } from 'maplibre-gl'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { MapboxMap, MapRef } from 'react-map-gl'
import { Popup } from 'react-map-gl'

import { ControlPanel } from '@/components/control-panel'
import { GeoMap } from '@/components/geo-map'
import { initialViewState, mapStyle } from '@/components/geo-map.config'
import { clusterLayer, lineStyle, unclusteredPointLayer } from '@/components/geo-map-layer.config'
import { LayerCollection } from '@/components/layer-collection'
import { usePopoverState } from '@/components/popover'
import { clearSpiderifiedCluster, spiderifyCluster } from '@/components/spiderifier'
import { TimeSlider } from '@/components/timeslider'
import { useInstitutionPlaces } from '@/lib/use-institutions-places'
import { usePersonsInstitutions } from '@/lib/use-persons-institutions'
import { usePersonsPersons } from '@/lib/use-persons-persons'
import { usePersonsPlaces } from '@/lib/use-persons-places'

let id_feature = 1

export function MainMap(): JSX.Element {
  const { persons, places, relationsByPlace, relationsByPerson } = usePersonsPlaces()

  const { personPersonRelationsBySourcePersonId, personPersonRelationsByTargetPersonId } =
    usePersonsPersons()

  const { relationsByPlaceInst, relationsByInstitution } = useInstitutionPlaces()

  const { relationsByPerson_Inst, relationsByInstitution_Pers } = usePersonsInstitutions()

  const mapRef = useRef<MapRef>(null)

  const id = useMemo(() => {
    return {
      source: 'places-data',
      layer: 'places',
    }
  }, [])

  const [mainPerson, setMainPerson] = useState('')
  const [mainPersonId, setMainPersonId] = useState(520)

  function changeMainPerson(person: string) {
    setMainPerson(person)
  }

  const pointsSinglePerson = useMemo(() => {
    function buildPoint(
      personId: number,
      targetCollection: FeatureCollection,
      mainPerson: boolean,
      idArray: Array<number>,
    ) {
      const relationsPerson = relationsByPerson.get(personId)
      const relationsInst = relationsByPerson_Inst.get(personId)

      let relationsPlace: Array<Record<string, any>> = []
      if (relationsInst) {
        relationsPlace = [...relationsInst]
      }
      if (relationsPerson) {
        relationsPlace = [...relationsPlace, ...relationsPerson]
      }

      relationsPlace.forEach((relation) => {
        let idPlace: number
        if (relation['related_place'] !== undefined) {
          idPlace = relation['related_place']['id']
        } else {
          if (relation['related_institution'] !== undefined) {
            const instPlace = relationsByInstitution.get(relation['related_institution']['id'])
            if (instPlace && instPlace[0]) {
              idPlace = instPlace[0]['related_place']['id']
            }
          }
        }
        const place = places.find((item) => {
          return item.id === idPlace
        })
        if (place) {
          if (place.lng !== null && place.lat !== null) {
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
                mainPerson: mainPerson,
                /** NOTE: Be aware that nested objects and arrays get stringified on `event.features`. */
              },
            }
            if (point.properties !== null) {
              if (relation['related_institution'] !== undefined) {
                point.properties['id_institution'] = relation['related_institution']['id']
                point.properties['institution'] = relation['related_institution']['label']
                point.properties['person'] = relation['related_person']['label']
                point.properties['type'] = 'institution'
                point.properties['relations'] = relationsByInstitution_Pers.get(
                  relation['related_institution']['id'],
                )
              } else {
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
              }
            }
            if (point.properties !== null && point.properties['id_institution'] !== undefined) {
              if (!idArray.includes(relation['related_institution']['id'])) {
                targetCollection.features.push(point)
                idArray.push(relation['related_institution']['id'])
              }
            } else {
              targetCollection.features.push(point)
            }
          }
        }
      })
    }

    const points: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    }

    const idArray: Array<number> = []

    buildPoint(mainPersonId, points, true, idArray)
    const relationsSource = personPersonRelationsBySourcePersonId.get(mainPersonId)
    relationsSource?.forEach((relation) => {
      buildPoint(relation.related_personB.id, points, false, idArray)
    })
    const relationsTarget = personPersonRelationsByTargetPersonId.get(mainPersonId)
    relationsTarget?.forEach((relation) => {
      buildPoint(relation.related_personA.id, points, false, idArray)
    })

    return points
  }, [
    id,
    persons,
    personPersonRelationsBySourcePersonId,
    personPersonRelationsByTargetPersonId,
    mainPersonId,
    places,
    relationsByPerson,
    relationsByInstitution,
    relationsByInstitution_Pers,
    relationsByPerson_Inst,
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
  }, [mainPerson, persons, pointsSinglePerson, linesSinglePerson])

  const allPoints = useMemo(() => {
    const points: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    }
    places.forEach((place) => {
      const relationsInst = relationsByPlaceInst.get(place.id)
      const relationsPerson = relationsByPlace.get(place.id)
      const idArray: Array<number> = []
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
              point.properties['relations'] = relationsByInstitution_Pers.get(
                relation['related_institution']['id'],
              )
              point.properties['type'] = 'institution'
            }
          }
          if (point.properties !== null && point.properties['id_institution'] !== undefined) {
            if (!idArray.includes(relation['related_institution']['id'])) {
              if (point.properties['relations'] !== undefined) {
                points.features.push(point)
                idArray.push(relation['related_institution']['id'])
              }
            }
          } else {
            points.features.push(point)
          }
        }
      })
    })
    return points
  }, [places, persons, relationsByPlace, id, relationsByPlaceInst, relationsByInstitution_Pers])

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

  function setSingleModeMap(isSinglePersonMode: boolean) {
    if (isSinglePersonMode === false) {
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

  const [_start, _end] = timeRange
  const checkDates = useCallback(
    function checkDates(start: string, end: string) {
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
    },
    [_start, _end],
  )

  // This set helps with the toggling of relations lines when their start and end points are toggled, i.e. when there's no start or end point visible on the map.
  const [pointsList, setPointsList] = useState(new Set())

  const toggleLines = useCallback(
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
        if (line.properties !== null) {
          if (filters['Person relations'].includes(line.properties['type'])) {
            placeFilter = true
          }
          timeFilter = checkDates(line.properties['start'], line.properties['end'])
          line.properties['id_places'].forEach((id_place: Array<number>) => {
            if (pointsList.has(id_place)) {
              counterPointsDis += 1
            }
          })
          if (counterPointsDis < 2) {
            pointFilter = true
          }
          if (timeFilter === true && placeFilter === true && pointFilter === true) {
            line.properties['visibility'] = true
            lines.features.push(line)
          } else {
            line.properties['visibility'] = false
          }
        }
      })
      // eslint-disable-next-line
      if (map.getSource('lines-data') !== undefined) {
        // @ts-expect-error Ignore for now
        map.getSource('lines-data').setData(lines)
      }
      map.triggerRepaint()
    },
    [allLines.features, checkDates, filters, pointsList],
  )

  const onTogglePoints = useCallback(
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
        timeFilter = checkDates(point.properties['start'], point.properties['end'])

        // Check what filters return
        if (
          timeFilter === true &&
          placeFilter === true &&
          professionFilter === true &&
          personFilter === true
        ) {
          if (point.properties !== null) {
            // If all filters are true, set visibility to True and push point into feature collection
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
          }
        } else {
          if (point.properties !== null) {
            point.properties['visibility'] = false
            // Add the now invisible point to the list of points which are not visible on the map
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
    },
    [allPoints.features, checkDates, filters],
  )

  // toggle lines if the points visible on the map change
  useEffect(() => {
    if (mapRef.current !== null) {
      // @ts-expect-error Ignore for now
      toggleLines(mapRef.current)
    }
  }, [pointsList])

  useEffect(() => {
    if (mapRef.current !== null) {
      // @ts-expect-error Ignore for now
      onTogglePoints(mapRef.current)
    }
  }, [filters, timeRange, onTogglePoints])

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
      mapRef.current.getMap().on('click', 'clusters', () => {
        clearSpiderifiedCluster(mapRef.current)
      })
      mapRef.current.getMap().on('zoom', () => {
        clearSpiderifiedCluster(mapRef.current)
      })
    }
  }, [mapRef])

  const popover = usePopoverState()
  const { show, hide } = popover

  function generatePopupContent(event: { features: Array<Feature> | null; lngLat: any }) {
    function createUrl(pathname: string) {
      const baseUrl = 'https://ica.acdh-dev.oeaw.ac.at/apis/entities/entity/'
      const url = new URL(pathname, baseUrl)
      return String(url)
    }

    if (event.features == null) return
    const features = [...event.features]
    let label = ''
    let link = ''
    let text = ''
    let contentPart
    const content: Array<JSX.Element> = []
    let type = ''
    features.forEach((feature) => {
      if (feature.properties == null) return
      type = feature.geometry.type
      let persLink = ''
      let featureLabel = ''
      let addPersonForInst = ''
      if (type === 'Point') {
        label = feature.properties['place']
        link = createUrl(`place/${feature.properties['id_place']}/detail`)
        const pointType = feature.properties['type']

        if (pointType === 'institution') {
          featureLabel = feature.properties['institution']
          persLink = createUrl(`institution/${feature.properties['id_institution']}/detail`)
          addPersonForInst = feature.properties['person']

          content.push(
            <a href={persLink} target="_blank" rel="noreferrer">
              <strong className="font-medium">{featureLabel}</strong>
            </a>,
          )
          if (feature.properties['relations'] !== undefined) {
            JSON.parse(feature.properties['relations']).forEach((relation: Record<string, any>) => {
              text = [
                relation['related_person']['label'],
                relation['relation_type']['label'],
                [relation['start_date_written'], relation['end_date_written']]
                  .filter(Boolean)
                  .join('-'),
              ]
                .filter(Boolean)
                .join('. ')
              link = createUrl(`person/${relation['related_person']['id']}/detail`)

              contentPart = (
                <div
                  className="grid gap-2 font-sans text-xs leading-4 text-gray-800"
                  key={feature['id']}
                >
                  <ul className="grid gap-1">
                    <li>
                      <a href={link} target="_blank" rel="noreferrer">
                        {text}
                      </a>
                    </li>
                  </ul>
                </div>
              )
              content.push(contentPart)
            })
          }
        } else {
          featureLabel = feature.properties['person']
          persLink = createUrl(`person/${feature.properties['id_person']}/detail`)

          text = [
            addPersonForInst,
            feature.properties['relation'],
            label,
            [feature.properties['start'], feature.properties['end']].filter(Boolean).join('-'),
          ]
            .filter(Boolean)
            .join('. ')

          contentPart = (
            <div
              className="grid gap-2 font-sans text-xs leading-4 text-gray-800"
              key={feature['id']}
            >
              <a href={persLink} target="_blank" rel="noreferrer">
                <strong className="font-medium">{featureLabel}</strong>
              </a>
              <ul className="grid gap-1">
                <li>
                  <a href={link} target="_blank" rel="noreferrer">
                    {text}
                  </a>
                </li>
              </ul>
            </div>
          )
          content.push(contentPart)
        }
      } else if (type === 'LineString') {
        featureLabel = feature.properties['source']
        link = createUrl(`person/${feature.properties['id_source']}/detail`)
        text = [
          feature.properties['type'],
          feature.properties['target'],
          [feature.properties['start'], feature.properties['end']].filter(Boolean).join('-'),
        ]
          .filter(Boolean)
          .join('. ')
        persLink = createUrl(`person/${feature.properties['id_target']}/detail`)
        contentPart = (
          <div className="grid gap-2 font-sans text-xs leading-4 text-gray-800" key={feature['id']}>
            <a href={persLink} target="_blank" rel="noreferrer">
              <strong className="font-medium">{featureLabel}</strong>
            </a>
            <ul className="grid gap-1">
              <li>
                <a href={link} target="_blank" rel="noreferrer">
                  {text}
                </a>
              </li>
            </ul>
          </div>
        )
        content.push(contentPart)
      }
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      longitude = event.lngLat!.lng
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
