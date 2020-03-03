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
      @resize="resize"
      @load="onMapLoad"
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

const ACCESS_TOKEN = config.MAPBOX_TOKEN
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
      accessToken: ACCESS_TOKEN, // your access token. Needed if you using Mapbox maps
      mapStyle: MAP_STYLE, // your map style
      destinationCoordinates: [],
      center: [4.895168, 52.370216],
      styleOfTheMap: {},
      mapbox: null,
    }
  },
  methods: {
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
    resize() {
      // this.$refs.routeMap.resize()
      // console.log('map is getting resized', event)
    },
    async makeSmaller() {
      // const routeMap = this.$refs.routeMap
      // const mapbox = await routeMap.mapboxPromise
      // console.log('routemap ', routeMap)
      // console.log('mapbox promise', mapbox)
      // this.styleOfTheMap = {
      //   width: '50%',
      // }
      var mapDiv = document.getElementById('map')
      var mapCanvas = document.getElementsByClassName('mapboxgl-canvas')[0]
      mapDiv.style.width = '100px'
      mapCanvas.style.width = '100%'
      setTimeout(() => {
        // console.log(this.map.getMax)

        this.map.resize()
        this.map.fitBounds(this.map.getBounds())
        this.map.triggerRepaint()
        console.log(this.map)
      }, 1000)
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
  top: $header-height;
  left: 0;
  width: $map-width;
  height: $map-height;
}
.ghost-map {
  height: $map-height;
}
</style>
