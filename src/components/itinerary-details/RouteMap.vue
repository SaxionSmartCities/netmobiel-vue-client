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
      <mgl-marker
        v-if="destinationCoordinates.length > 1"
        :coordinates="destinationCoordinates"
        color="red"
      />
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
    legs: {
      type: Array,
      default: Array,
      required: true,
    },
  },
  data() {
    return {
      leg: null,
      accessToken: ACCESS_TOKEN, // your access token. Needed if you using Mapbox maps
      mapStyle: MAP_STYLE, // your map style
      destinationCoordinates: [],
      center: [4.895168, 52.370216],
      styleOfTheMap: {},
      mapbox: null,
      showShrinkMeBtn: false,
    }
  },
  created() {
    if (this.legs.length === 1) {
      this.leg = this.legs[0]
    }
    console.log('[CREATED] Route map', this.legs)
  },
  methods: {
    onMoveEnd() {
      this.$emit('loaded', {})
    },
    async onMapLoad(event) {
      this.map = event.map

      if (this.legs.length === 1) {
        this.initiateMapSingleLeg(event.map, this.legs[0])
      } else if (this.legs.length > 1) {
        this.initiateMapWholeRoute(event.map, this.legs)
      }
    },
    initiateMapSingleLeg(map, leg) {
      const result = polyline.toGeoJSON(leg.legGeometry.points)
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

      map.fitBounds(
        [
          result.coordinates[0],
          result.coordinates[result.coordinates.length - 1],
        ],
        { padding: 50 }
      )

      map.addSource('route', {
        type: 'geojson',
        data: route,
      })

      map.addSource('points', {
        type: 'geojson',
        data: points,
      })

      map.addLayer({
        id: 'points',
        source: 'points',
        type: 'circle',
      })

      map.addLayer({
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
    async initiateMapWholeRoute(map, legs) {
      const result = legs.map(leg => polyline.toGeoJSON(leg.legGeometry.points))

      let features = []
      let beginPoints = []
      let endPoints = []
      result.forEach(leg => {
        features.push({
          type: 'Feature',
          geometry: leg,
        })
        beginPoints.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: leg.coordinates[0],
          },
        })
        endPoints.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: leg.coordinates[leg.coordinates.length - 1],
          },
        })
      })

      console.log('features: ', features)
      console.log('points: ', beginPoints)
      map.addSource('legs', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: features,
        },
      })
      map.addSource('beginPoints', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: beginPoints,
        },
      })
      map.addSource('endPoints', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: endPoints,
        },
      })

      map.addLayer({
        id: 'legs',
        type: 'line',
        source: 'legs',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#007cbf',
          'line-width': 1,
        },
      })
      const finalDestinationCoordinates =
        result[result.length - 1].coordinates[
          result[result.length - 1].coordinates.length - 1
        ]
      await this.resizeMap()
      map.fitBounds([result[0].coordinates[0], finalDestinationCoordinates], {
        padding: 15,
      })

      this.destinationCoordinates = finalDestinationCoordinates
      map.addLayer({
        id: 'beginPoints',
        source: 'beginPoints',
        type: 'circle',
        paint: {
          'circle-radius': 3,
          'circle-color': '#ff0a10',
        },
      })
      map.addLayer({
        id: 'endPoints',
        source: 'endPoints',
        type: 'circle',
        paint: {
          'circle-radius': 3,
          'circle-color': '#000000',
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
