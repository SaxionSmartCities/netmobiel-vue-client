<template>
  <mgl-map
    id="map"
    :access-token="accessToken"
    :map-style="mapStyle"
    :center="center"
    :zoom="6"
    @load="onMapLoad"
  >
    <mgl-marker :coordinates="destinationCoordinates" color="red" />
  </mgl-map>
</template>

<script>
import Mapbox from 'mapbox-gl'
import { MglMap, MglMarker } from 'vue-mapbox'
var polyline = require('@mapbox/polyline')

const ACCESS_TOKEN =
  'pk.eyJ1IjoidGltb3RoeS1zZWFseSIsImEiOiJjazcxcG04a3MwOHNqM2Zta2VhOGpkb2xtIn0.EELRFGDmbR-0m761gF6A6Q'
const MAP_STYLE = 'mapbox://styles/mapbox/streets-v11'

export default {
  name: 'RouteMap',
  components: { MglMap, MglMarker },
  props: {
    leg: {
      default: Object,
      required: true,
    },
  },
  data() {
    return {
      mapBox: null,
      map: null,
      accessToken: ACCESS_TOKEN, // your access token. Needed if you using Mapbox maps
      mapStyle: MAP_STYLE, // your map style
      destinationCoordinates: [],
      center: [4.895168, 52.370216],
    }
  },
  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox
  },
  methods: {
    async onMapLoad(event) {
      const result = polyline.toGeoJSON(this.leg.legGeometry.points)
      this.destinationCoordinates =
        result.coordinates[result.coordinates.length - 1]

      let route = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: result,
          },
        ],
      }

      let points = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              title: 'start',
            },
            geometry: {
              type: 'Point',
              coordinates: result.coordinates[0],
            },
          },
          {
            type: 'Feature',
            properties: {
              title: 'end',
            },
            geometry: {
              type: 'Point',
              coordinates: result.coordinates[result.coordinates.length - 1],
            },
          },
        ],
      }

      event.map.fitBounds(
        [
          result.coordinates[0],
          result.coordinates[result.coordinates.length - 1],
        ],
        { padding: 50 }
      )

      event.map.addSource('route', {
        type: 'geojson',
        data: route,
      })

      event.map.addSource('points', {
        type: 'geojson',
        data: points,
      })

      event.map.addLayer({
        id: 'points',
        source: 'points',
        type: 'circle',
      })

      event.map.addLayer({
        id: 'route',
        source: 'route',
        type: 'line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-width': 4,
          'line-color': '#007cbf',
          'line-dasharray': [2, 4],
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
#map {
  width: 100vw;
  height: 200px;
}
</style>
