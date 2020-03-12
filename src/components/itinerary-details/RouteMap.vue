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
    <v-row v-if="isLoaded">
      <v-btn
        v-if="mapSize !== 'fullscreen'"
        fab
        small
        class="map-fullscreen"
        @click="mapSize = 'fullscreen'"
      >
        <v-icon>fullscreen</v-icon>
      </v-btn>
      <v-btn
        v-if="mapSize === 'fullscreen'"
        class="map-fullscreen-exit"
        fab
        small
        @click="mapSize = 'small'"
      >
        <v-icon>
          fullscreen_exit
        </v-icon>
      </v-btn>
    </v-row>
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
    mapSizeProp: { type: String, default: 'small', required: false },
  },
  data() {
    return {
      leg: null,
      accessToken: ACCESS_TOKEN, // your access token. Needed if you using Mapbox maps
      mapStyle: MAP_STYLE, // your map style
      destinationCoordinates: [],
      isLoaded: false,
      center: [4.895168, 52.370216],
      styleOfTheMap: {},
      mapbox: null,
      showShrinkMeBtn: false,
    }
  },
  computed: {
    mapSize: {
      get: function() {
        return this.mapSizeProp
      },
      set: function(value) {
        this.$emit('sizeChanged', { size: value })
      },
    },
  },
  created() {
    if (this.legs.length === 1) {
      this.leg = this.legs[0]
    }
    console.log('[CREATED] Route map', this.legs)
  },
  methods: {
    onMoveEnd() {
      this.isLoaded = true
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
    onResize() {
      this.map.fitBounds(this.map.getBounds())
    },
    changeMapSize({ height, width }) {
      var mapDiv = document.getElementById('map')
      var mapCanvas = document.getElementsByClassName('mapboxgl-canvas')[0]
      mapDiv.style.height = height
      mapCanvas.style.width = width
      this.map.resize()
    },
    async resizeMap() {
      var mapDiv = document.getElementById('map')
      var mapCanvas = document.getElementsByClassName('mapboxgl-canvas')[0]
      mapDiv.style.height = '100vh'
      mapCanvas.style.width = '100%'
      this.map.resize()
    },
  },
  watch: {
    mapSizeProp: function(newValue, oldValue) {
      console.log('mapSize changed from ', oldValue, 'to: ', newValue)
      newValue === 'small' &&
        this.changeMapSize({ height: '200px', width: '100%' })
      newValue === 'fullscreen' &&
        this.changeMapSize({ height: '100vh', width: '100%' })
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
.map-fullscreen {
  top: 10px;
  left: 10px;
  position: absolute;
  z-index: 4;
}

.map-fullscreen-exit {
  top: 10px;
  left: 10px;
  position: absolute;
  z-index: 4;
}
</style>
