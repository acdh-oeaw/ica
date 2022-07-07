import { PageMetadata } from '@stefanprobst/next-page-metadata'
import React, { Fragment, useCallback, useRef, useState } from 'react'
import { Layer, Popup, Source } from 'react-map-gl'

import { useI18n } from '@/app/i18n/use-i18n'
import { withDictionaries } from '@/app/i18n/with-dictionaries'
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template'
import ControlPanel from '@/components/control-panel'
import { GeoMap } from '@/components/geo-map'
import { base as baseMap } from '@/components/geo-map-base-layer.config'

import { layerStyle, lineStyle } from './layers'

export const getStaticProps = withDictionaries(['common'])

export default function HomePage(): JSX.Element {
  const { t } = useI18n<'common'>()
  const titleTemplate = usePageTitleTemplate()

  const metadata = { title: t(['common', 'home', 'metadata', 'title']) }
  const [PopupInfo, setPopupInfo] = useState(null)

  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [16.35323, 48.240234] },
        properties: {
          Name: 'John Gunther',
          Type: 'Person',
          Adress: 'Dollinergasse 5, 1190, Vienna',
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [16.36735, 48.213089] },
        properties: {
          Name: 'Café Louvre',
          Type: 'Place',
          Adress: 'Wipplingerstraße 27, 1010 Vienna',
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [16.361413, 48.197215] },
        properties: {
          Name: 'Dorothy Thompson',
          Type: 'Person',
          Adress: 'Rechte Wienzeile 31, 1040, Vienna',
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [16.334765, 48.233707] },
        properties: {
          Name: 'Richard Beer-Hofmann',
          Type: 'Person',
          Adress: 'Hasenauerstraße 59, 1190, Vienna',
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [16.334765, 48.233707] },
        properties: {
          Name: 'Miriam Beer-Hofmann Lens',
          Type: 'Person',
          Adress: 'Hasenauerstraße 59, 1190, Vienna',
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [16.3632, 48.21864] },
        properties: {
          Name: 'Tiffany Burlingham',
          Type: 'Person',
          Adress: 'Berggasse 19, 1090, Vienna',
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [16.357269, 48.215329] },
        properties: {
          Name: 'Muriel Gardiner',
          Type: 'Person',
          Adress: 'Frankgasse 1, 1090, Vienna',
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [16.3632, 48.21864] },
        properties: {
          Name: 'Siegmund Freud',
          Type: 'Person',
          Adress: 'Berggasse 19, 1090, Vienna',
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [16.37989, 48.188373] },
        properties: {
          Name: 'Thornton Wilder',
          Type: 'Person',
          Adress: 'Wiedner Gürtel 6, 1040, Vienna',
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [16.383845, 48.202252] },
        properties: {
          Name: 'William Shirer',
          Type: 'Person',
          Adress: 'Reisnerstrasse 15, 1030 Vienna',
        },
      },
    ],
  }

  const relationGeojson = {
    type: 'FeatureCollection',
    features: [],
  }

  const relationships = {
    'Visited regularly': { 'Café Louvre': ['Dorothy Thompson', 'John Gunther', 'William Shirer'] },
    'Friends with': {
      'Dorothy Thompson': ['John Gunther', 'Tiffany Burlingham', 'William Shirer'],
      'John Gunther': ['William Shirer'],
    },
    'Child of': { 'Richard Beer-Hofmann': ['Miriam Beer-Hofmann Lens'] },
    'Doctor of': { 'Siegmund Freud': ['Muriel Gardiner', 'Tiffany Burlingham'] },
    'Meeting with': { 'Siegmund Freud': ['Thornton Wilder'] },
    'Helped to emigrate': {
      'Thornton Wilder': ['Richard Beer-Hofmann', 'Miriam Beer-Hofmann Lens'],
    },
  }

  Object.keys(relationships).forEach((relationship) => {
    Object.keys(relationships[relationship]).forEach((i) => {
      let startPoint
      geojson.features.forEach((point) => {
        if (point.properties.Name === i) {
          startPoint = point.geometry.coordinates
        }
      })
      relationships[relationship][i].forEach((j) => {
        let endPoint
        geojson.features.forEach((point) => {
          if (point.properties.Name === j) {
            endPoint = point.geometry.coordinates
          }
        })
        relationGeojson.features.push({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: [startPoint, endPoint] },
          properties: { Name: relationship },
        })
      })
    })
  })

  const onPopup = useCallback((event) => {
    event.originalEvent.stopPropagation()
    const {
      features,
      point: { x, y },
    } = event
    if (features.length > 0) {
      const PopupedFeature = features && features[0]
      const lat = event.lngLat.lat
      const lng = event.lngLat.lng
      const names = []
      features.forEach((feature) => {
        if (!names.includes(feature.properties.Name)) {
          names.push(feature.properties.Name)
        }
      })
      const name = names.toString(', ')
      // prettier-ignore
      setPopupInfo(PopupedFeature && {feature: PopupedFeature, name, lat, lng});
      mapRef.current?.flyTo({ center: [lng, lat], duration: 1000 })
    } else {
      setPopupInfo(null)
    }
  }, [])

  const mapRef = useRef<MapRef>()

  const onToggleLayer = useCallback((name, checked) => {
    if (checked === true) {
      mapRef.current?.getMap().setLayoutProperty(name, 'visibility', 'visible')
    } else if (checked === false) {
      mapRef.current?.getMap().setLayoutProperty(name, 'visibility', 'none')
    }
  }, [])

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <main>
        <h1>Hello, world!</h1>
        <GeoMap
          {...baseMap}
          interactiveLayerIds={[layerStyle.id, lineStyle.id]}
          onClick={onPopup}
          ref={mapRef}
        >
          <Source id="relations" type="geojson" data={relationGeojson}>
            <Layer {...lineStyle} />
          </Source>
          <Source id="data" type="geojson" data={geojson}>
            <Layer {...layerStyle} />
          </Source>
          {PopupInfo && (
            <Popup
              anchor="top"
              longitude={Number(PopupInfo.lng)}
              latitude={Number(PopupInfo.lat)}
              onClose={() => {
                return setPopupInfo(null)
              }}
            >
              <div>
                <span>{PopupInfo.name}</span>
              </div>
            </Popup>
          )}
          <ControlPanel onToggleLayer={onToggleLayer} />
        </GeoMap>
      </main>
    </Fragment>
  )
}
