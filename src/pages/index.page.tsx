import { PageMetadata } from '@stefanprobst/next-page-metadata'
import type { Feature, FeatureCollection } from 'geojson'
import { Fragment, useCallback, useRef, useState } from 'react'
import type { MapRef } from 'react-map-gl'
import { Layer, Popup, Source } from 'react-map-gl'

import { useI18n } from '@/app/i18n/use-i18n'
import { withDictionaries } from '@/app/i18n/with-dictionaries'
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template'
import { ControlPanel } from '@/components/control-panel'
import { GeoMap } from '@/components/geo-map'
import { base as baseMap } from '@/components/geo-map-base-layer.config'
import { layerStyle, lineStyle } from '@/components/layers'
import { geojson, relationships } from '@/components/mock-data'
import { usePersonsPlaces } from '@/lib/use-persons-places'

export const getStaticProps = withDictionaries(['common'])

type PopupContent = {
  feature: Feature
  names: Record<string, any>
  relations: Record<string, any>
  lat: number
  lng: number
}

export default function HomePage(): JSX.Element {
  const { t } = useI18n<'common'>()
  const titleTemplate = usePageTitleTemplate()

  const metadata = { title: t(['common', 'home', 'metadata', 'title']) }
  const [popupInfo, setPopupInfo] = useState<PopupContent | null>(null)

  const relationGeojson: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  }

  Object.keys(relationships).forEach((relationship) => {
    // @ts-expect-error TODO: fix later please
    Object.keys(relationships[relationship]).forEach((i) => {
      let startPoint: any
      let to: any
      geojson.features.forEach((point) => {
        // @ts-expect-error TODO: fix later please
        if (point.properties['name'] === i) {
          // @ts-expect-error TODO: fix later please
          startPoint = point.geometry.coordinates
          // @ts-expect-error TODO: fix later please
          to = point.properties.name
        }
      })
      // @ts-expect-error TODO: fix later please
      relationships[relationship][i].forEach((j) => {
        let endPoint
        let from
        geojson.features.forEach((point) => {
          // @ts-expect-error TODO: fix later please
          if (point.properties.name === j) {
            // @ts-expect-error TODO: fix later please
            endPoint = point.geometry.coordinates
            // @ts-expect-error TODO: fix later please
            from = point.properties.name
          }
        })
        relationGeojson.features.push({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: [startPoint, endPoint] },
          properties: {
            type: relationship,
            from: from,
            to: to,
            fromCoords: endPoint,
            toCoords: startPoint,
          },
        })
      })
    })
  })

  const onPopup = useCallback((event: any) => {
    event.originalEvent.stopPropagation()
    const { features } = event
    if (features.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const PopupedFeature = features[0]!
      const lat = event.lngLat.lat
      const lng = event.lngLat.lng
      const names = {}
      const relations = {}
      features.forEach((feature: any) => {
        if (feature.layer.type === 'circle') {
          if (!Object.keys(names).includes(feature.properties.name)) {
            // @ts-expect-error TODO: fix later please
            names[feature.properties.name] = [feature.properties.type, feature.properties.id]
          }
        } else if (feature.layer.type === 'line') {
          if (!Object.keys(relations).includes(feature.properties.name)) {
            // @ts-expect-error TODO: fix later please
            relations[feature.properties.type] = [[feature.properties.to, feature.properties.from]]
          } else {
            // @ts-expect-error TODO: fix later please
            relations[feature.properties.type].push([
              feature.properties.to,
              feature.properties.from,
            ])
          }
        }
      })
      setPopupInfo({ feature: PopupedFeature, names, relations, lat, lng })
      if (features.length === 1 && features[0].layer.type === 'line') {
        mapRef.current?.fitBounds(
          [features[0].geometry.coordinates[0], features[0].geometry.coordinates[1]],
          { padding: 100, duration: 2000 },
        )
      } else {
        mapRef.current?.flyTo({ center: [lng, lat], duration: 2000 })
      }
    } else {
      setPopupInfo(null)
    }
  }, [])

  const mapRef = useRef<MapRef>(null)

  const onToggleLayer = useCallback((name: string, checked: boolean) => {
    if (checked === true) {
      mapRef.current?.getMap().setLayoutProperty(name, 'visibility', 'visible')
    } else {
      mapRef.current?.getMap().setLayoutProperty(name, 'visibility', 'none')
    }
  }, [])

  const onToggleSubLayer = useCallback((name: string, checked: boolean, category: string) => {
    // @ts-expect-error TODO: fix later please
    let filter = mapRef.current?.getMap().getLayer(category).filter.slice(2)
    if (checked === false) {
      filter = filter.filter((e: string) => {
        return e !== name
      })
    } else {
      filter.push(name)
    }
    mapRef.current?.getMap().setFilter(category, buildFilter(filter))
  }, [])

  function buildFilter(arr: Array<string>) {
    const filter = ['in', 'type']
    if (arr.length === 0) {
      return filter
    }
    for (let i = 0; i < arr.length; i += 1) {
      const value = arr[i]
      if (value != null) {
        filter.push(value)
      }
    }
    return filter
  }

  const onToggleBasemap = useCallback((basemap: string) => {
    mapRef.current
      ?.getMap()
      .setStyle(`https://basemaps.cartocdn.com/gl/${basemap}-gl-style/style.json`)
  }, [])

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <main>
        <Hero />
        <div style={{ height: '100vh' }}>
          <GeoMap
            {...baseMap}
            interactiveLayerIds={[layerStyle.id!, lineStyle.id!]}
            onClick={onPopup}
            ref={mapRef}
          >
            <Source id="relations" type="geojson" data={relationGeojson}>
              <Layer {...lineStyle} />
            </Source>
            <Source id="data" type="geojson" data={geojson}>
              <Layer {...layerStyle} />
            </Source>
            {popupInfo && (
              <Popup
                anchor="top"
                longitude={Number(popupInfo.lng)}
                latitude={Number(popupInfo.lat)}
                onClose={() => {
                  setPopupInfo(null)
                }}
                style={{ color: 'black' }}
              >
                <div>
                  {Object.keys(popupInfo.names).length > 0 && <b>Located here:</b>}
                  {Object.keys(popupInfo.names).map((name) => {
                    return (
                      <div key={name}>
                        <a
                          href={`https://ica.acdh-dev.oeaw.ac.at/apis/entities/entity/${popupInfo.names[name][0]}/${popupInfo.names[name][1]}/detail`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <u>{name}</u>
                        </a>
                      </div>
                    )
                  })}
                  {Object.keys(popupInfo.relations).length > 0 && <b>Relations:</b>}
                  {Object.keys(popupInfo.relations).map((relation) => {
                    return (
                      <div key={relation}>
                        <span>
                          <em>{relation}:</em>
                        </span>
                        {popupInfo.relations[relation].map((r: any) => {
                          return (
                            <div key={r}>
                              <span>
                                {r[0]} -&gt; {r[1]}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              </Popup>
            )}
            <ControlPanel
              onToggleLayer={onToggleLayer}
              onToggleBasemap={onToggleBasemap}
              onToggleSubLayer={onToggleSubLayer}
            />
          </GeoMap>
        </div>
        <PlacesSection />
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

function PlacesSection(): JSX.Element {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 py-8 px-8">
      <h3 className="text-xl font-bold">Places</h3>
      <PlacesList />
    </section>
  )
}

function PlacesList(): JSX.Element {
  const { places } = usePersonsPlaces()
  const placesWithCoordinates = places.filter((place) => {
    if (place.lat != null && place.lng != null) return true
    // eslint-disable-next-line no-console
    console.info(`${place.name} has no coordinates`)
    return false
  })

  return (
    <ul role="list" className="grid gap-1">
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
