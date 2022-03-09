<template>
  <div class="map-container">
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
        v-if="arrivalCoords.length > 1"
        :coordinates="arrivalCoords"
        color="#ff8500"
      />
    </mgl-map>
    <div v-if="!isLoading">
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
        fab
        small
        class="map-fullscreen"
        @click="mapSize = 'small'"
      >
        <v-icon> fullscreen_exit </v-icon>
      </v-btn>
      <v-btn fab small class="map-close" @click="$emit('closeMap')">
        <v-icon>close</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { MglMap, MglMarker } from 'v-mapbox'
import config from '@/config/config'
import constants from '@/constants/constants'
import 'mapbox-gl/dist/mapbox-gl.css'
import 'v-mapbox/dist/v-mapbox.css'
import Mapbox from 'mapbox-gl'

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
    singleLegDashed: { type: Boolean, default: true, required: false },
  },
  data() {
    return {
      accessToken: ACCESS_TOKEN, // your access token. Needed if you using Mapbox maps
      mapStyle: MAP_STYLE, // your map style
      arrivalCoords: [],
      isLoading: true,
      center: [
        constants.GEOLOCATION_CENTER_NL.longitude,
        constants.GEOLOCATION_CENTER_NL.latitude,
      ],
      mapbox: null,
    }
  },
  computed: {
    mapSize: {
      get: function () {
        return this.mapSizeProp
      },
      set: function (value) {
        this.$emit('sizeChanged', { size: value })
      },
    },
  },
  watch: {
    mapSizeProp: function (newValue) {
      this.setMapSize(newValue)
    },
  },
  created() {
    this.isLoading = true
    this.mapbox = Mapbox
  },
  methods: {
    onMoveEnd() {
      this.$emit('loaded', {})
      this.isLoading = false
    },
    async onMapLoad(event) {
      this.map = event.map
      this.setMapSize(this.mapSizeProp)
      this.drawRoute(
        event.map,
        this.legs,
        this.legs.length === 1 && this.singleLegDashed
      )
    },
    drawRoute(map, legs, dashedLines) {
      const geoLegs = legs.map((leg) =>
        polyline.toGeoJSON(leg.legGeometry.points)
      )
      let features = []
      let beginPoints = []
      let endPoints = []
      geoLegs.forEach((leg) => {
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
      const legPaintStyle = {
        'line-color': '#2e8997',
        'line-width': 4,
      }
      if (dashedLines) {
        legPaintStyle['line-dasharray'] = [2, 4]
      }
      map.addLayer({
        id: 'legs',
        type: 'line',
        source: 'legs',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: legPaintStyle,
      })
      const bbox = this.findBoundingBox(geoLegs)
      map.fitBounds(bbox, {
        padding: 25,
      })
      const lastGeoLeg = geoLegs[geoLegs.length - 1]
      this.arrivalCoords = [
        ...lastGeoLeg.coordinates[lastGeoLeg.coordinates.length - 1],
      ]
      map.addLayer({
        id: 'beginPoints',
        source: 'beginPoints',
        type: 'circle',
        paint: {
          'circle-radius': 4,
          'circle-color': '#ff0a10',
        },
      })
      map.addLayer({
        id: 'endPoints',
        source: 'endPoints',
        type: 'circle',
        paint: {
          'circle-radius': 4,
          'circle-color': '#000000',
        },
      })
    },
    /**
     * Finds the left upper corner (nw) and right lower corner (se) to fit in the view port.
     * @param geoLegs an array of geo coordinates
     * @return {*[]} two coordinates (longitude, latitude)
     */
    findBoundingBox(geoLegs) {
      const firstGeoLeg = geoLegs[0]
      const lastGeoLeg = geoLegs[geoLegs.length - 1]
      const nw = [...firstGeoLeg.coordinates[0]]
      const se = [...lastGeoLeg.coordinates[lastGeoLeg.coordinates.length - 1]]
      const minReducer = (previous, current) =>
        current < previous ? current : previous
      const maxReducer = (previous, current) =>
        current > previous ? current : previous

      nw[1] = geoLegs
        .flatMap((leg) => leg.coordinates)
        .map((coord) => coord[1])
        .reduce(maxReducer, nw[1])
      nw[0] = geoLegs
        .flatMap((leg) => leg.coordinates)
        .map((coord) => coord[0])
        .reduce(minReducer, nw[0])
      se[1] = geoLegs
        .flatMap((leg) => leg.coordinates)
        .map((coord) => coord[1])
        .reduce(minReducer, nw[1])
      se[0] = geoLegs
        .flatMap((leg) => leg.coordinates)
        .map((coord) => coord[0])
        .reduce(maxReducer, nw[0])
      return [nw, se]
    },
    onResize() {
      this.map.fitBounds(this.map.getBounds())
    },
    changeMapSize({ height, width }) {
      const mapDiv = document.getElementById('map')
      const mapCanvas = document.getElementsByClassName('mapboxgl-canvas')[0]
      if (mapDiv && mapCanvas) {
        mapDiv.style.height = height
        mapCanvas.style.width = width
      }
      if (this.map) {
        this.map.resize()
      }
    },
    setMapSize(size) {
      if (size === 'small') {
        this.changeMapSize({ height: '200px', width: '100%' })
      } else if (size === 'fullscreen') {
        this.changeMapSize({ height: '100vh', width: '100%' })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.map-container {
  position: relative;
}

#map {
  height: $map-height;
}

.map-fullscreen {
  position: absolute;
  top: 10px;
  left: 10px;
}

.map-close {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
