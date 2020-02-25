<template>
  <mgl-map
    id="map"
    :access-token="accessToken"
    :map-style="mapStyle"
    @load="onMapLoad"
  >
    <mgl-marker :coordinates="coordinates" color="blue" />
  </mgl-map>
</template>

<script>
import Mapbox from 'mapbox-gl'
import { MglMap, MglMarker } from 'vue-mapbox'
const ACCESS_TOKEN =
  'pk.eyJ1IjoidGltb3RoeS1zZWFseSIsImEiOiJjazcxcG04a3MwOHNqM2Zta2VhOGpkb2xtIn0.EELRFGDmbR-0m761gF6A6Q'
const MAP_STYLE = 'mapbox://styles/mapbox/streets-v11'
export default {
  name: 'RouteMap',
  components: { MglMap, MglMarker },
  data() {
    return {
      mapBox: null,
      map: null,
      accessToken: ACCESS_TOKEN, // your access token. Needed if you using Mapbox maps
      mapStyle: MAP_STYLE, // your map style
      coordinates: [-111.549668, 39.014],
      geoJsonSource: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [6.416015625, 52.25050528572611],
        },
      },
      geoJsonLayer: {
        //...some GeoJSON layer configuration object
      },
    }
  },
  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox
  },
  methods: {
    async onMapLoad(event) {
      // this.map = event.map;
      // Here we cathing 'load' map event
      // const asyncActions = event.component.actions
      //
      // const newParams = await asyncActions.flyTo({
      //   center: [30, 30],
      //   zoom: 3,
      //   speed: 1,
      // })
      event.map.fitBounds([
        [6.416015625, 52.25050528572611],
        [6.7950439453125, 52.267316957465944],
      ])
      // console.log(newParams)
      /* => {
              center: [30, 30],
              zoom: 9,
              bearing: 9,
              pitch: 7
            }
      */
    },
  },
}
</script>

<style lang="scss" scoped>
#map {
  height: 400px;
}
</style>
