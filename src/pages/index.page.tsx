import { PageMetadata } from '@stefanprobst/next-page-metadata'
import React, { Fragment , useCallback, useState} from 'react'
import {Layer,Popup,Source} from 'react-map-gl';
import { start } from 'repl';

import { useI18n } from '@/app/i18n/use-i18n'
import { withDictionaries } from '@/app/i18n/with-dictionaries'
import { usePageTitleTemplate } from '@/app/metadata/use-page-title-template'
import { GeoMap } from '@/components/geo-map'
import { base as baseMap } from '@/components/geo-map-base-layer.config'

export const getStaticProps = withDictionaries(['common'])

export default function HomePage(): JSX.Element {
  const { t } = useI18n<'common'>()
  const titleTemplate = usePageTitleTemplate()

  const metadata = { title: t(['common', 'home', 'metadata', 'title']) }
  const [PopupInfo, setPopupInfo] = useState(null);

  const geojson = {
    type: 'FeatureCollection',
    features: [
      {type: 'Feature', geometry: {type: 'Point', coordinates: [16.35323,  48.240234]}, properties: {'Name': 'John Gunther', 'Type': 'Person'}},
      {type: 'Feature', geometry: {type: 'Point', coordinates: [16.36735,  48.213089]}, properties: {'Name': 'Café Louvre', 'Type': 'Place'}},
      {type: 'Feature', geometry: {type: 'Point', coordinates: [16.361413,  48.197215]}, properties: {'Name': 'Dorothy Thompson', 'Type': 'Person'}},
    ]
  };

  const relationGeojson = {
    type: 'FeatureCollection',
    features: [],
  };

  const relationships = {
    'Visited regularly': {'Café Louvre': ['Dorothy Thompson', 'John Gunther']},
    'Friends with': {'John Gunther': ['Dorothy Thompson']}
  };
  Object.keys(relationships).forEach((relationship) => {
    Object.keys(relationships[relationship]).forEach((i) => {
      let startPoint;
      geojson.features.forEach((point) => {
        if (point.properties.Name === i) { startPoint = point.geometry.coordinates; }
      })
      relationships[relationship][i].forEach((j) => {
        let endPoint;
        geojson.features.forEach((point) => {
          if (point.properties.Name === j) { endPoint = point.geometry.coordinates; }
        })
        relationGeojson.features.push(
          {
            type: 'Feature', 
            geometry: {type: 'LineString', coordinates: [startPoint, endPoint]}, 
            properties: {'Name': relationship}
          }
        );
      })
    })
  });
  

  const layerStyle: Layer = {
    id: 'data',
    type: 'circle',
    paint: {
      'circle-radius': 10,
      'circle-color': [
        "match",
        ["get", "Type"],
        "Person", "red",
        "Place", "green",
        "yellow"
      ]
    }
  };
  const lineStyle: Layer = {
    id: 'relations',
    type: 'line',
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-color': [
        "match",
        ["get", "Name"],
        "Visited regularly", "orange",
        "Friends with", "pink",
        "yellow"
      ],
      'line-width': 5
    }
  };

  const onPopup = useCallback(event => {
    console.log(event);
    event.originalEvent.stopPropagation();
    const {
      features,
      point: {x, y}
    } = event;
    if (features.length > 0) {
      const PopupedFeature = features && features[0];
      const lat = event.lngLat.lat;
      const lng = event.lngLat.lng;
      const name = features[0].properties.Name;
      // prettier-ignore
      setPopupInfo(PopupedFeature && {feature: PopupedFeature, name, lat, lng});
    } else { setPopupInfo(null); }
  }, []);

  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <main>
        <h1>Hello, world!</h1>
        <GeoMap {...baseMap} 
          interactiveLayerIds={[layerStyle.id, lineStyle.id]}
          onClick={onPopup} >
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
             onClose={() => {return setPopupInfo(null)}}
            >
             <div>
               <span>{PopupInfo.name}</span>
             </div>
           </Popup>
          )}
        </GeoMap>
      </main>
    </Fragment>
  )
}
