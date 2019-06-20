<template>
  <v-layout column>
    <v-flex id="headerregel" red>
      <v-layout row>
        <v-flex id="tijd" xs2>{{ printableTime }}</v-flex>
        <v-flex id="bolletje" xs1>
          <v-layout column align-center>
            <v-flex>
              <div class="open-dot"></div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex id="locatienaam">{{ header }}</v-flex>
      </v-layout>
    </v-flex>
    <v-flex id="icoonborderdetails" green>
      <v-layout row>
        <v-flex id="icon" xs2>
          <v-icon> {{ getIcon }}</v-icon>
        </v-flex>
        <v-flex id="bordertje" xs1 text-xs-center>
          <span v-if="leg.mode !== 'FINISH'">|</span>
        </v-flex>
        <v-flex id="details"> {{ description }} </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment'

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
    printableTime: function() {
      let result

      if (!this.isLastLeg) {
        result = moment(this.leg.startTime)
          .locale('nl')
          .format('LT')
      } else {
        result = moment(this.leg.endTime)
          .locale('nl')
          .format('LT')
      }

      return result
    },
    header: function() {
      switch (this.leg.mode) {
        case 'WALK':
          return 'Lopen naar ' + this.leg.to.lat + ' ' + this.leg.to.lon
        case 'CAR':
        case 'NETMOBIEL':
          return 'Meerijden met NETMOBIEL gebruiker'
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
          return 'warning'
      }
    },
    description: function() {
      switch (this.leg.mode) {
        case 'WALK':
          return (
            'Vanaf ' +
            this.leg.from.lat +
            ' ' +
            this.leg.from.lon +
            ' naar ' +
            this.leg.to.lat +
            ' ' +
            this.leg.to.lon
          )
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
          return 'warning'
      }
    },
    getIcon: function() {
      switch (this.leg.mode) {
        case 'WALK':
          return 'directions_walk'
        case 'CAR':
        case 'NETMOBIEL':
          return 'directions_car'
        case 'TRAIN':
          return 'train'
        case 'BUS':
          return 'directions_bus'
        case 'RAIL':
          return 'directions_railway'
        case 'WAIT':
          return 'timelapse'
        case 'FINISH':
          return 'outlined_flag'
        default:
          return 'warning'
      }
    },
  },
}
</script>

<style lang="scss">
.open-dot {
  border-style: solid;
  border-width: 2px;
  border-radius: 10000px;
  border-color: green;
  width: 2vw;
  height: 2vw;
}
</style>
