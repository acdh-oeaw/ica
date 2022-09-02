// credit goes to: Franck Kerbiriou & Ross Alexander https://github.com/FranckKe/mapbox-gl-js-cluster-spiderify

import type { Feature } from 'maplibre-gl'
import { Marker } from 'maplibre-gl'

const SPIDER_TYPE = 'layer' // marker: use Mapbox's Marker. layer: Use a Mabpbox point layer
const MAX_LEAVES_TO_SPIDERIFY = 255 // Max leave to display when spiderify to prevent filling the map with leaves
const CIRCLE_TO_SPIRAL_SWITCHOVER = SPIDER_TYPE.toLowerCase() === 'marker' ? 10 : 15 // When below number, will display leave as a circle. Over, as a spiral

const CIRCLE_OPTIONS = {
  distanceBetweenPoints: 50,
}

const SPIRAL_OPTIONS = {
  rotationsModifier: 1250, // Higher modifier = closer spiral lines
  distanceBetweenPoints: SPIDER_TYPE.toLowerCase() === 'marker' ? 42 : 32, // Distance between points in spiral
  radiusModifier: 50000, // Spiral radius
  lengthModifier: 1000, // Spiral length modifier
}

const SPIDER_LEGS_LAYER_NAME = 'spider-legs'
const SPIDER_LEGS_PAINT_OPTION = {
  'line-width': 3,
  'line-color': 'rgba(128, 128, 128, 0.5)',
}

const SPIDER_LEAVES_LAYER_NAME = 'spider-leaves'
const SPIDER_LEAVES_PAINT_OPTION = {
  'circle-color': [
    'match',
    ['get', 'profession'],
    'historian (Q201788)',
    'red',
    'writer (Q36180)',
    'yellow',
    'journalist (Q1930187)',
    'green',
    'blue',
  ],
  'circle-radius': 8,
  'circle-stroke-width': 1,
  'circle-stroke-color': '#fff',
}

let clusterMarkers: Array<any> = []
let spiderifiedCluster = {}
let spiderLeavesCollection = []

function clearSpiderifiedMarkers() {
  if (clusterMarkers.length > 0) {
    for (let i = 0; i < clusterMarkers.length; i++) {
      clusterMarkers[i].remove()
    }
  }
  clusterMarkers = []
}

function removeSourceAndLayer(map: any, id: string) {
  if (map.getLayer(id) != null) map.removeLayer(id)
  if (map.getSource(id) != null) map.removeSource(id)
}

export function clearSpiderifiedCluster(map: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  spiderifiedCluster = {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  spiderLeavesCollection = []
  removeSourceAndLayer(map.getMap(), SPIDER_LEGS_LAYER_NAME)
  removeSourceAndLayer(map.getMap(), SPIDER_LEAVES_LAYER_NAME)
  clearSpiderifiedMarkers()
}

function generateEquidistantPointsInCircle({ totalPoints = 1, options = CIRCLE_OPTIONS }) {
  const points = []
  const theta = (Math.PI * 2) / totalPoints
  let angle = theta
  for (let i = 0; i < totalPoints; i++) {
    angle = theta * i
    points.push({
      x: options.distanceBetweenPoints * Math.cos(angle),
      y: options.distanceBetweenPoints * Math.sin(angle),
    })
  }
  return points
}

function generateEquidistantPointsInSpiral({ totalPoints = 10, options = SPIRAL_OPTIONS }) {
  const points = [{ x: 0, y: 0 }]
  // Higher modifier = closer spiral lines
  const rotations = totalPoints * options.rotationsModifier
  const distanceBetweenPoints = options.distanceBetweenPoints
  const radius = totalPoints * options.radiusModifier
  // Value of theta corresponding to end of last coil
  const thetaMax = rotations * 2 * Math.PI
  // How far to step away from center for each side.
  const awayStep = radius / thetaMax
  for (
    let theta = distanceBetweenPoints / awayStep;
    points.length <= totalPoints + options.lengthModifier;

  ) {
    points.push({
      x: Math.cos(theta) * (awayStep * theta),
      y: Math.sin(theta) * (awayStep * theta),
    })
    theta += distanceBetweenPoints / (awayStep * theta)
  }
  return points.slice(0, totalPoints)
}

function generateLeavesCoordinates(leaves: number) {
  // Position cluster's leaves in circle if below threshold, spiral otherwise
  let points
  if (leaves < CIRCLE_TO_SPIRAL_SWITCHOVER) {
    points = generateEquidistantPointsInCircle({
      totalPoints: leaves,
    })
  } else {
    points = generateEquidistantPointsInSpiral({
      totalPoints: leaves,
    })
  }
  return points
}

export function spiderifyCluster({ map, source, clusterToSpiderify }: any) {
  const spiderlegsCollection: Array<any> = []
  const spiderLeavesCollection: Array<any> = []

  map
    .getSource(source)
    .getClusterLeaves(
      clusterToSpiderify.id,
      MAX_LEAVES_TO_SPIDERIFY,
      0,
      (error: Error | null, features: Array<Feature>) => {
        if (error != null) {
          console.warn('Cluster does not exists on this zoom')
          return
        }

        const leavesCoordinates = generateLeavesCoordinates(features.length)

        const clusterXY = map.project(clusterToSpiderify.coordinates)

        // Generate spiderlegs and leaves coordinates
        features.forEach((element, index) => {
          const spiderLeafLatLng = map.unproject([
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            clusterXY.x + leavesCoordinates[index]!.x,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            clusterXY.y + leavesCoordinates[index]!.y,
          ])

          if (SPIDER_TYPE.toLowerCase() === 'marker') {
            clusterMarkers.push(new Marker().setLngLat(spiderLeafLatLng))
          }
          if (SPIDER_TYPE.toLowerCase() === 'layer') {
            spiderLeavesCollection.push({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [spiderLeafLatLng.lng, spiderLeafLatLng.lat],
              },
              properties: element.properties,
            })
          }

          spiderlegsCollection.push({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                clusterToSpiderify.coordinates,
                [spiderLeafLatLng.lng, spiderLeafLatLng.lat],
              ],
            },
          })
        })

        map.getMap().addLayer({
          id: SPIDER_LEGS_LAYER_NAME,
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: spiderlegsCollection,
            },
          },
          paint: SPIDER_LEGS_PAINT_OPTION,
        })

        if (SPIDER_TYPE.toLowerCase() === 'marker') {
          clusterMarkers.forEach((marker) => {
            return marker.addTo(map)
          })
        }
        if (SPIDER_TYPE.toLowerCase() === 'layer') {
          map.getMap().addLayer({
            id: SPIDER_LEAVES_LAYER_NAME,
            type: 'circle',
            source: {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: spiderLeavesCollection,
              },
            },
            paint: SPIDER_LEAVES_PAINT_OPTION,
          })
        }
      },
    )
}
