<template>
  <v-layout column>
    <v-flex body-1>
      <v-layout row>
        <v-flex xs2>{{ time }}</v-flex>
        <v-flex xs1>
          <v-layout column align-center fill-height>
            <v-flex class="border"><div class="open-dot"/></v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs9>
          <div class="d-flex flex-row justify-space-between shrink">
            {{ header }}
            <v-icon
              v-if="leg.traverseMode === 'WALK'"
              :class="{ 'active-map': isMapActive }"
              @click="$emit('legSelect', { leg, step })"
            >
              map
            </v-icon>
          </div>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex>
      <v-layout row>
        <v-flex xs2 my-3>
          <v-icon my-6>{{ icon }}</v-icon>
        </v-flex>
        <v-flex xs1>
          <v-layout
            v-if="travelMode !== 'FINISH' && travelMode !== 'ARRIVAL'"
            justify-center
            fill-height
          >
            <v-flex shrink>
              <div
                v-if="travelMode === 'WAIT'"
                class="borderstopped borderwidth"
              />
              <div v-else class="border borderwidth" />
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs8 caption>
          {{ description }}
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment'
import travelModes from '@/constants/travel-modes.js'
import delegation from '@/utils/delegation'

export default {
  name: 'ItineraryLeg',
  props: {
    leg: { type: Object, required: true },
    isMapActive: { type: Boolean, default: false },
    step: { type: Number, default: 0 },
  },
  computed: {
    travelMode() {
      //HACK: planner returns traverseMode except for FINISH leg :(
      return this.leg.traverseMode || this.leg.mode
    },
    icon() {
      return travelModes[this.travelMode].icon
    },
    time: function() {
      return moment(this.leg.startTime)
        .locale('nl')
        .format('LT')
    },
    header() {
      return delegation(this, this.travelMode, headers)
    },
    description() {
      return delegation(this, this.travelMode, descriptions)
    },
  },
}

const headers = {
  WALK() {
    return `Lopen (${humanDistance(this.leg.distance)})`
  },
  CAR() {
    return this.leg.from.name
  },
  RIDESHARE: 'Meerijden met een Netmobiel gebruiker',
  RAIL() {
    return `${this.leg.routeShortName} naar ${this.leg.to.label}`
  },
  BUS() {
    return `Reizen met bus ${this.leg.routeShortName}`
  },
  WAIT() {
    return `Even wachten.. (${Math.round(this.leg.duration / 60)} minuten)`
  },
  FINISH: 'Aangekomen op bestemming',
  ARRIVAL() {
    // car arrival when sharing a ride
    return this.leg.from.name
  },
  SUBWAY() {
    return `${this.leg.routeShortName} naar ${this.leg.to.label}`
  },
  default: 'HEADER NOT DEFINED FOR THIS LEG MODE!',
}
const descriptions = {
  WALK() {
    return `${this.leg.from.label} - ${this.leg.to.label}`
  },
  CAR: '',
  RIDESHARE: 'Meerijden met een Netmobiel gebruiker',
  RAIL() {
    // add platform to departure and arrival
    return `${this.leg.from.label} perron ${this.leg.from.platformCode} - ${
      this.leg.to.label
    } perron ${this.leg.to.platformCode}`
  },
  BUS() {
    return `${this.leg.from.label} - ${this.leg.to.label}`
  },
  WAIT: '',
  FINISH: '',
  ARRIVAL: '',
  SUBWAY() {
    return `${this.leg.from.name} - ${this.leg.to.name}`
  },
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
  height: 24px;
  width: 24px;
  background-size: cover;
  background-position: bottom;
  background-repeat: no-repeat;
}

.border {
  background: url('../../assets/itinerarysolidline.gif');
  background-position: center;
  background-repeat-x: no-repeat;
  height: 100%;
}
.borderwidth {
  width: 5px;
}
.borderstopped {
  background: url('../../assets/itinerarystripedline.gif');
  background-position: center;
  background-repeat-x: no-repeat;
  height: 100%;
}
.active-map {
  @extend .selected-map;
}
</style>
