import { PageMetadata } from '@stefanprobst/next-page-metadata'
import React, { Fragment ,useMemo,useState} from 'react'
import {Marker,Popup} from 'react-map-gl';

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

  const [popupInfo, setPopupInfo] = useState(null);
  const json = [
      {'Name': 'John Gunther', 'longitude': 16.3531, 'latitude': 48.2399}
  ];
  const pins = useMemo(
    () =>
      {return json.map((place, index) => {return (
        <Marker
          key={`marker-${index}`}
          longitude={place.longitude}
          latitude={place.latitude}
          anchor="bottom"
          onClick={e => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(place);
          }}
        >
        </Marker>
      )})},
    []
  );
  return (
    <Fragment>
      <PageMetadata title={metadata.title} titleTemplate={titleTemplate} />
      <main>
        <h1>Hello, world!</h1>
        <GeoMap {...baseMap}>
          {pins}
          {popupInfo && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.longitude)}
            latitude={Number(popupInfo.latitude)}
            onClose={() => {return setPopupInfo(null)}}
          >
            <div>
              <span>{popupInfo.Name}</span>
            </div>
          </Popup>
          )}
        </GeoMap>
      </main>
    </Fragment>
  )
}
