<template>
  <v-row no-gutters>
    <v-col>
      <v-row no-gutters align="center" justify="center">
        <v-col cols="2" class="time px-0">
          {{ time }}
        </v-col>
        <v-col cols="1" align="center">
          <div class="open-dot" />
        </v-col>
        <v-col>
          <v-row class="pl-2">
            <v-col class="header py-0">
              {{ header }}
            </v-col>
            <v-col cols="2" class="map-icon-height py-0">
              <v-icon
                v-if="leg.traverseMode === 'WALK'"
                :class="{ 'active-map': isMapActive }"
                @click="$emit('legSelect', { leg, step })"
              >
                map
              </v-icon>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row v-if="travelMode !== 'FINISH'" no-gutters>
        <v-col cols="2" class="pl-2">
          <v-icon v-if="showicon" :class="{ rideshare: isRideShare }">
            {{ icon }}
          </v-icon>
        </v-col>
        <v-col cols="1" justify="center" align="center" fill-height>
          <div v-if="travelMode === 'WALK'" class="borderstopped borderwidth" />
          <div v-else-if="travelMode === 'ARRIVAL'" class="no-border" />
          <div v-else-if="showdottedline" class="borderstopped borderwidth" />
          <div v-else class="border borderwidth" />
        </v-col>
        <v-col class="description pl-2 pb-3">
          {{ description }}
        </v-col>
      </v-row>
    </v-col>
  </v-row>
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
    showicon: { type: Boolean, default: true },
    showdottedline: { type: Boolean, default: false },
  },
  computed: {
    travelMode() {
      //HACK: planner returns traverseMode except for FINISH leg :(
      return this.leg.traverseMode || this.leg.mode
    },
    icon() {
      return travelModes[this.travelMode].icon
    },
    time() {
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
    isRideShare() {
      return this.travelMode === travelModes.RIDESHARE.mode
    },
  },
}

const headers = {
  WALK() {
    return `Lopen (${humanDistance(this.leg.distance)})`
  },
  CAR: 'Vertrek',
  RIDESHARE: 'Meerijden',
  RAIL() {
    return `${this.leg.routeShortName} naar ${this.leg.to.label}`
  },
  BUS() {
    return `Reizen met bus ${this.leg.routeShortName}`
  },
  WAIT() {
    return `Even wachten.. (${Math.round(this.leg.duration / 60)} minuten)`
  },
  FINISH: 'Gearriveerd',
  ARRIVAL: 'Aankomst',
  SUBWAY() {
    return `${this.leg.routeShortName} naar ${this.leg.to.label}`
  },
  default: 'HEADER NOT DEFINED FOR THIS LEG MODE!',
}
const descriptions = {
  WALK() {
    return `${this.leg.from.label} - ${this.leg.to.label}`
  },
  CAR() {
    return this.leg.from.name
  },
  RIDESHARE() {
    return `Meerijden met ${this.leg.driverName}`
  },
  RAIL() {
    // add platform to departure and arrival
    return `${this.leg.from.label} perron ${this.leg.from.platformCode} - ${this.leg.to.label} perron ${this.leg.to.platformCode}`
  },
  BUS() {
    return `${this.leg.from.label} - ${this.leg.to.label}`
  },
  WAIT: '',
  FINISH: '',
  ARRIVAL() {
    // car arrival when sharing a rideg
    return this.leg.from.name
  },
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
.time {
  font-size: 0.8em;
}
.header {
  font-size: 0.9em;
}
.description {
  font-size: 0.7em;
}
.map-icon-height {
  height: 24px;
}
.rideshare {
  color: $color-secondary !important;
}

.open-dot {
  background: url('../../assets/travel_details_dot.gif');
  height: 25px;
  width: 25px;
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
