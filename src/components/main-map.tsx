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
import { usePopoverState } from '@/components/Popover'
import { clearSpiderifiedCluster, spiderifyCluster } from '@/components/spiderifier'
import { TimeSlider } from '@/components/timeslider'
import { useInstitutionPlaces } from '@/lib/use-institutions-places'
import { usePersonsPersons } from '@/lib/use-persons-persons'
import { usePersonsPlaces } from '@/lib/use-persons-places'

let id_feature = 1

export function MainMap(): JSX.Element {
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
        if (pointType === 'institution') {
          featureLabel = feature.properties['institution']
          persLink = `https://ica.acdh-dev.oeaw.ac.at/apis/entities/entity/institution/${feature.properties['id_institution']}/detail`
        } else {
          featureLabel = feature.properties['person']
          persLink = `https://ica.acdh-dev.oeaw.ac.at/apis/entities/entity/person/${feature.properties['id_person']}/detail`
        }
        text = [
          featureLabel,
          feature.properties['relation'],
          [feature.properties['start'], feature.properties['end']].filter(Boolean).join('-'),
        ]
          .filter(Boolean)
          .join('. ')
        console.log(text)
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