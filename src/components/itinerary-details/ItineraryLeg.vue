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
          <v-icon my-6>{{ icon }}</v-icon>
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
          <v-icon v-if="leg.mode !== 'WAIT' && leg.mode !== 'FINISH'" size="15">map</v-icon>
          {{ description }}
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment'
import { getIcon } from '@/utils/Utils.js'
import delegation from '@/utils/delegation'

export default {
  name: 'ItineraryLeg',
  props: {
    leg: {
      type: Object,
      required: true,
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
    header() {
      return delegation(this, this.leg.mode, headers)
    },
    description() {
      return delegation(this, this.leg.mode, descriptions)
    },
  },
}

const headers = {
  WALK() {
    return `Lopen (${humanDistance(this.leg.distance)})`
  },
  CAR: 'Meerijden met een NETMOBIEL gebruiker',
  NETMOBIEL: 'Meerijden met een NETMOBIEL gebruiker',
  RAIL() {
    return `${this.leg.routeShortName} naar ${this.leg.to.name}`
  },
  BUS() {
    return `Reizen met bus ${this.leg.routeShortName}`
  },
  WAIT() {
    return `Even wachten.. (${Math.round(this.leg.duration / 60)} minuten)`
  },
  FINISH: 'Aangekomen op bestemming',
  default: 'HEADER NOT DEFINED FOR THIS LEG MODE!',
}
const descriptions = {
  WALK() {
    // use first and last step with proper street name
    const departureName = this.leg.steps.find(step => !step.bogusName)
      .streetName
    const arrivalName = this.leg.steps
      .slice(0)
      .reverse()
      .find(step => !step.bogusName).streetName
    return `${departureName} - ${arrivalName}`
  },
  CAR: 'Meerijden met een NETMOBIEL gebruiker',
  NETMOBIEL: 'Meerijden met een NETMOBIEL gebruiker',
  RAIL() {
    // add platform to departure and arrival
    return `${this.leg.from.name} perron ${this.leg.from.platformCode} - ${
      this.leg.to.name
    } perron ${this.leg.to.platformCode}`
  },
  BUS() {
    return `${this.leg.from.name} - ${this.leg.to.name}`
  },
  WAIT: '',
  FINISH: '',
  default: 'DESCRIPTION NOT DEFINED FOR THIS LEG MODE!',
}

// TODO common utility?
function humanDistance(meters) {
  if (meters < 1000) {
    // 10m accuracy if less than 1 km
    return `${Math.floor(meters / 10) * 10} m`
  } else if (meters < 10000) {
    // 100m accuracy if less than 10 km
    return `${Math.floor(meters / 100) / 10} km`
  } else {
    // km accuracy if more than 10 km
    return `${Math.floor(meters / 1000)} km`
  }
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
  border: 2px $color-primary solid;
  height: 100%;
}

.borderstopped {
  width: 1px;
  border: 2px $color-primary-light dotted;
  height: 100%;
}
</style>
