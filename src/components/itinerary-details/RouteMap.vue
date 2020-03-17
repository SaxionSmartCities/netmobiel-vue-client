<template>
  <div>
    <mgl-map
      id="map"
      ref="routeMap"
      :mapbox-gl="mapbox"
      :access-token="accessToken"
      :map-style="mapStyle"
      :center="center"
      :zoom="6"
      :track-size="true"
      @resize="onResize"
      @load="onMapLoad"
      @moveend="onMoveEnd"
    >
      <mgl-marker :coordinates="destinationCoordinates" color="red" />
    </mgl-map>
    <div class="ghost-map"></div>
  </div>
</template>

<script>
import { MglMap, MglMarker } from 'vue-mapbox'
import config from '@/config/config'

const polyline = require('@mapbox/polyline')
const MAP_STYLE = 'mapbox://styles/mapbox/streets-v11'
const ACCESS_TOKEN = config.MAPBOX_TOKEN

export default {
  name: 'RouteMap',
  components: { MglMap, MglMarker },
  props: {
    leg: {
      type: Object,
      default: Object,
      required: true,
    },
  },
  data() {
    return {
      accessToken: ACCESS_TOKEN, // your access token. Needed if you using Mapbox maps
      mapStyle: MAP_STYLE, // your map style
      destinationCoordinates: [],
      center: [4.895168, 52.370216],
      styleOfTheMap: {},
      mapbox: null,
      showShrinkMeBtn: false,
    }
  },
  methods: {
    onMoveEnd() {
      this.$emit('loaded', {})
    },
    async onMapLoad(event) {
      this.map = event.map

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
    shrinkMap() {
      var mapDiv = document.getElementById('map')
      mapDiv.style.height = '200px'
      this.map.resize()
    },
    onResize() {
      this.map.fitBounds(this.map.getBounds())
    },
    async resizeMap() {
      var mapDiv = document.getElementById('map')
      var mapCanvas = document.getElementsByClassName('mapboxgl-canvas')[0]
      mapDiv.style.height = '100vh'
      mapCanvas.style.width = '100%'
      this.map.resize()
    },
  },
}
</script>

<style lang="scss" scoped>
.activated {
  width: 100px !important;
}
#map {
  position: fixed;
  z-index: 1;
  top: $header-height;
  left: 0;
  width: $map-width;
  height: $map-height;
}
.ghost-map {
  height: $map-height;
}
</style>
