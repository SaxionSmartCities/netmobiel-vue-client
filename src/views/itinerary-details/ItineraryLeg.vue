<template>
  <v-layout column>
    <v-flex>
      <v-layout row>
        <v-flex xs2>{{ time }}</v-flex>
        <v-flex xs1>
          <v-layout column align-center full-height>
            <v-flex>
              <div class="open-dot"></div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>{{ header }}</v-flex>
      </v-layout>
    </v-flex>
    <v-flex>
      <v-layout row>
        <v-flex xs2 my-3>
          <v-icon my-6> {{ icon }}</v-icon>
        </v-flex>
        <v-flex xs1>
          <v-layout v-if="leg.mode !== 'FINISH'" justify-center fill-height>
            <v-flex shrink>
              <div v-if="leg.mode === 'WAIT'" class="borderstopped"></div>
              <div v-else class="border"></div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex caption>
          <v-icon v-if="leg.mode !== 'WAIT'" size="15">map</v-icon>
          {{ description }}
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment'
import { getIcon } from '@/utils/Utils.js'

export default {
  name: 'ItineraryLeg',
  props: {
    leg: {
      type: Object,
      default: function() {
        return {}
      },
    },
  },
  computed: {
    icon: function() {
      return getIcon(this.leg.mode)
    },
    time: function() {
      return moment(this.leg.startTime)
        .locale('nl')
        .format('LT')
    },
    header: function() {
      switch (this.leg.mode) {
        case 'WALK':
          // return 'Lopen' naar ' + this.leg.to.lat + ' ' + this.leg.to.lon'
          return 'Lopen'
        case 'CAR':
        case 'NETMOBIEL':
          return 'Meerijden met NETMOBIEL gebruiker'
        case 'RAIL':
          return 'Trein'
        case 'BUS':
          return 'Reizen met bus ' + this.leg.routeShortName
        case 'WAIT':
          return (
            'Even wachten..' +
            ' (' +
            Math.round(this.leg.duration / 60) +
            ' minuten)'
          )
        case 'FINISH':
          return 'Aangekomen op bestemming'
        default:
          return 'HEADER_NOT_DEFINED'
      }
    },
    description: function() {
      switch (this.leg.mode) {
        case 'WALK':
          console.log(this.leg)
          return 'Lopen van ergens, naar ergens anders'
        // return (
        //   'Vanaf ' +
        //   this.leg.from.lat +
        //   ' ' +
        //   this.leg.from.lon +
        //   ' naar ' +
        //   this.leg.to.lat +
        //   ' ' +
        //   this.leg.to.lon
        // )
        case 'CAR':
        case 'NETMOBIEL':
          return 'Meerijden met een NETMOBIEL gebruiker'
        case 'TRAIN':
          return 'Reizen met de trein'
        case 'BUS':
          return 'Reizen met de bus'
        case 'RAIL':
          return 'Reizen met iets op rails'
        case 'WAIT':
          return ''
        case 'FINISH':
          return 'Aangekomen op ' + this.leg.to.lat + ' ' + this.leg.to.lon
        default:
          return 'DESCRIPTION_NOT_DEFINED'
      }
    },
  },
}
</script>

<style lang="scss">
.open-dot {
  background: url('../../assets/travel_details_dot.gif');
  height: 21px;
  width: 21px;
  background-size: cover;
}

.border {
  width: 1px;
  border: 2px #222 solid;
  height: 100%;
}

.borderstopped {
  width: 1px;
  border: 2px #ccc dotted;
  height: 100%;
}
</style>
