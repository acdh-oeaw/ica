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
          type: 'person',
          Adress: 'Dollinergasse 5, 1190, Vienna',
          id: '520'
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [16.36735, 48.213089] },
        properties: {
          Name: 'Café Louvre',
          type: 'institution',
          Adress: 'Wipplingerstraße 27, 1010 Vienna',
          id: '1953'
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [16.361413, 48.197215] },
        properties: {
          Name: 'Dorothy Thompson',
          type: 'person',
          Adress: 'Rechte Wienzeile 31, 1040, Vienna',
          id: '546',
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [16.334765, 48.233707] },
        properties: {
          Name: 'Richard Beer-Hofmann',
          type: 'person',
          Adress: 'Hasenauerstraße 59, 1190, Vienna',
          id: '622'
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [16.334765, 48.233707] },
        properties: {
          Name: 'Miriam Beer-Hofmann Lens',
          type: 'person',
          Adress: 'Hasenauerstraße 59, 1190, Vienna',
          id: '2841'
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [16.3632, 48.21864] },
        properties: {
          Name: 'Tiffany Burlingham',
          type: 'person',
          Adress: 'Berggasse 19, 1090, Vienna',
          id: '344'
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [16.357269, 48.215329] },
        properties: {
          Name: 'Muriel Gardiner',
          type: 'person',
          Adress: 'Frankgasse 1, 1090, Vienna',
          id: '5249'
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [16.3632, 48.21864] },
        properties: {
          Name: 'Siegmund Freud',
          type: 'person',
          Adress: 'Berggasse 19, 1090, Vienna',
          id: '223'
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [16.37989, 48.188373] },
        properties: {
          Name: 'Thornton Wilder',
          type: 'person',
          Adress: 'Wiedner Gürtel 6, 1040, Vienna',
          id: '672'
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [16.383845, 48.202252] },
        properties: {
          Name: 'William Shirer',
          type: 'person',
          Adress: 'Reisnerstrasse 15, 1030 Vienna',
          id: '523'
        },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [16.36003, 48.21315] },
        properties: {
          Name: 'Universität Wien',
          type: 'institution',
          Adress: 'Universitätsring 1, 1010 Wien',
          id: '765'
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
      'Thornton Wilder': ['Miriam Beer-Hofmann Lens']
    },
    'Child of': { 'Richard Beer-Hofmann': ['Miriam Beer-Hofmann Lens'] },
    'Doctor of': { 'Siegmund Freud': ['Muriel Gardiner', 'Tiffany Burlingham'] },
    'Meeting with': { 'Siegmund Freud': ['Thornton Wilder'] },
    'Helped to emigrate': {
      'Thornton Wilder': ['Richard Beer-Hofmann', 'Miriam Beer-Hofmann Lens'],
    },
    'Studied at': {
      'Universität Wien': ['Richard Beer-Hofmann', 'Muriel Gardiner'],
    },
  }

  Object.keys(relationships).forEach((relationship) => {
    Object.keys(relationships[relationship]).forEach((i) => {
      let startPoint;
      let to;
      geojson.features.forEach((point) => {
        if (point.properties.Name === i) {
          startPoint = point.geometry.coordinates;
          to = point.properties.Name;
        }
      })
      relationships[relationship][i].forEach((j) => {
        let endPoint;
        let from;
        geojson.features.forEach((point) => {
          if (point.properties.Name === j) {
            endPoint = point.geometry.coordinates
            from = point.properties.Name;
          }
        })
        relationGeojson.features.push({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: [startPoint, endPoint] },
          properties: { type: relationship, from: from, to: to, fromCoords: endPoint, toCoords: startPoint},
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
      const names = {}
      const relations = {}
      features.forEach((feature) => {
        if (feature.layer.type === 'circle') {
          if (!Object.keys(names).includes(feature.properties.Name)) {
            names[feature.properties.Name] = [feature.properties.type, feature.properties.id];
          }
        } else if (feature.layer.type === 'line') {
          if (!Object.keys(relations).includes(feature.properties.Name)) {
            relations[feature.properties.type] = [[feature.properties.to, feature.properties.from]];
          } else {
            relations[feature.properties.type].push([feature.properties.to, feature.properties.from]);
          }
        }
      })
      // prettier-ignore
      setPopupInfo(PopupedFeature && {feature: PopupedFeature, names, relations, lat, lng});
      if (features.length === 1 && features[0].layer.type === 'line') {
        mapRef.current?.fitBounds([features[0].geometry.coordinates[0], features[0].geometry.coordinates[1]], {padding: 100, duration: 2000})
      } else {
        mapRef.current?.flyTo({ center: [lng, lat], duration: 2000 })
      }
    } else {
      setPopupInfo(null)
    }
  }, [])

  const mapRef = useRef<MapRef>()

  const onToggleLayer = useCallback((name, checked) => {
    console.log(name, checked, mapRef.current?.getMap());
    // mapRef.current?.getMap().setFilter('places', ['==', 'type', 'person']);
    if (checked === true) {
      mapRef.current?.getMap().setLayoutProperty(name, 'visibility', 'visible')
    } else if (checked === false) {
      mapRef.current?.getMap().setLayoutProperty(name, 'visibility', 'none')
    }

  }, [])
  
  const onToggleSubLayer = useCallback((name, checked, cat) => {
    let filter = mapRef.current?.getMap().getLayer(cat).filter.slice(2);
    if (checked === false) {
      filter = filter.filter(e => e !== name); 
    } else if (checked === true) {
      filter.push(name);
    }
    mapRef.current?.getMap().setFilter(cat, buildFilter(filter));
  }, [])

  function buildFilter(arr) {
    var filter = ['in', 'type'];
    if (arr.length === 0) {
       return filter;
    } 
    for(var i = 0; i < arr.length; i += 1) {
      filter.push(arr[i]);
    }
    return filter;
  }

  const onToggleBasemap = useCallback((basemap, value) => {
    mapRef.current?.getMap().setStyle(`https://basemaps.cartocdn.com/gl/${basemap}-gl-style/style.json`);
  }, [])

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <main>
        <h1 style={{textAlign:'center',}}> Map Demo</h1>
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
            { Object.keys(PopupInfo.names).length > 0 &&
              <label><b>Located here:</b></label>
            }
                { Object.keys(PopupInfo.names).map((name) => {
                  return (
                    <div key={name}>
                      <a href={`https://ica.acdh-dev.oeaw.ac.at/apis/entities/entity/${PopupInfo.names[name][0]}/${PopupInfo.names[name][1]}/detail`} target="_blank" rel="noreferrer"><u>{name}</u></a>
                    </div>
                  )
                })}
              { Object.keys(PopupInfo.relations).length > 0 &&
              <label><b>Relations:</b></label>
              }  
                {Object.keys(PopupInfo.relations).map((relation) => {
                  return (
                    <div key={relation}>
                      <span><em>{relation}:</em></span>
                      {PopupInfo.relations[relation].map((r) => {
                        return (
                          <div key={r}>
                            	<span>{r[0]} -> {r[1]}</span>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
            </div>
            </Popup>
          )}
          <ControlPanel onToggleLayer={onToggleLayer} onToggleBasemap={onToggleBasemap} onToggleSubLayer={onToggleSubLayer}/>
        </GeoMap>
      </main>
    </Fragment>
  )
}
