import type { FeatureCollection } from 'geojson'

export const geojson: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [16.35323, 48.240234] },
      properties: {
        name: 'John Gunther',
        type: 'person',
        address: 'Dollinergasse 5, 1190, Vienna',
        id: '520',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [16.36735, 48.213089] },
      properties: {
        name: 'Café Louvre',
        type: 'institution',
        address: 'Wipplingerstraße 27, 1010 Vienna',
        id: '1953',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [16.361413, 48.197215] },
      properties: {
        name: 'Dorothy Thompson',
        type: 'person',
        address: 'Rechte Wienzeile 31, 1040, Vienna',
        id: '546',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [16.334765, 48.233707] },
      properties: {
        name: 'Richard Beer-Hofmann',
        type: 'person',
        address: 'Hasenauerstraße 59, 1190, Vienna',
        id: '622',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [16.334765, 48.233707] },
      properties: {
        name: 'Miriam Beer-Hofmann Lens',
        type: 'person',
        address: 'Hasenauerstraße 59, 1190, Vienna',
        id: '2841',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [16.3632, 48.21864] },
      properties: {
        name: 'Tiffany Burlingham',
        type: 'person',
        address: 'Berggasse 19, 1090, Vienna',
        id: '344',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [16.357269, 48.215329] },
      properties: {
        name: 'Muriel Gardiner',
        type: 'person',
        address: 'Frankgasse 1, 1090, Vienna',
        id: '5249',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [16.3632, 48.21864] },
      properties: {
        name: 'Siegmund Freud',
        type: 'person',
        address: 'Berggasse 19, 1090, Vienna',
        id: '223',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [16.37989, 48.188373] },
      properties: {
        name: 'Thornton Wilder',
        type: 'person',
        address: 'Wiedner Gürtel 6, 1040, Vienna',
        id: '672',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [16.383845, 48.202252] },
      properties: {
        name: 'William Shirer',
        type: 'person',
        address: 'Reisnerstrasse 15, 1030 Vienna',
        id: '523',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [16.36003, 48.21315] },
      properties: {
        name: 'Universität Wien',
        type: 'institution',
        address: 'Universitätsring 1, 1010 Wien',
        id: '765',
      },
    },
  ],
}

export const relationships = {
  'Visited regularly': { 'Café Louvre': ['Dorothy Thompson', 'John Gunther', 'William Shirer'] },
  'Friends with': {
    'Dorothy Thompson': ['John Gunther', 'Tiffany Burlingham', 'William Shirer'],
    'John Gunther': ['William Shirer'],
    'Thornton Wilder': ['Miriam Beer-Hofmann Lens'],
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
