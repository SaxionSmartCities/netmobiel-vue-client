<template>
  <v-row no-gutters>
    <v-col>
      <v-row no-gutters align="center" justify="center">
        <v-col cols="2" class="time px-0 mx-a">
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
            <v-col
              v-if="leg.traverseMode === 'WALK'"
              cols="2"
              class="map-icon-height py-0"
            >
              <v-icon
                :class="{ 'active-map': isMapActive }"
                @click="$emit('legSelect', { leg, step })"
              >
                map
              </v-icon>
            </v-col>
            <v-col v-if="leg.isEditable" cols="2" class="map-icon-height py-0">
              <v-icon @click="$emit('legEdit', { leg, step })">edit</v-icon>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="2" class="pl-2">
          <v-icon v-if="showicon" :class="{ rideshare: isRideShare }">
            {{ icon }}
          </v-icon>
        </v-col>
        <v-col cols="1" justify="center" align="center" fill-height>
          <div v-if="travelMode === 'WALK'" class="borderstopped borderwidth" />
          <div v-else-if="travelMode === 'ARRIVAL'" class="no-border" />
          <div v-else-if="travelMode === 'FINISH'" class="no-border" />
          <div v-else-if="showdottedline" class="borderstopped borderwidth" />
          <!-- <div v-else-if="isRideShare" class="borderrs borderwidth" /> -->
          <div v-else class="border borderwidth" />
        </v-col>
        <v-col class="description pl-2 pb-3">
          {{ description }}
          <itinerary-leg-passenger v-if="passenger" :passenger="passenger" />
          <itinerary-leg-driver v-if="hasDriver" :leg="leg" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'
import travelModes from '@/constants/travel-modes.js'
import ItineraryLegPassenger from '@/components/itinerary-details/ItineraryLegPassenger.vue'
import ItineraryLegDriver from '@/components/itinerary-details/ItineraryLegDriver.vue'

export default {
  name: 'ItineraryLeg',
  components: { ItineraryLegPassenger, ItineraryLegDriver },
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
      return this.leg.startTime
        ? moment(this.leg.startTime)
            .locale('nl')
            .format('LT')
        : '- - : - -'
    },
    header() {
      return headers[this.travelMode]
        ? headers[this.travelMode].call(this, this.step)
        : 'Undefined mode'
    },
    description() {
      return descriptions[this.travelMode]
        ? descriptions[this.travelMode].call(this, this.step)
        : 'Undefined mode'
    },
    passenger() {
      return this.leg.passenger
    },
    isRideShare() {
      return (
        this.travelMode === travelModes.RIDESHARE.mode ||
        (this.passenger && this.travelMode === travelModes.CAR.mode)
      )
    },
    hasDriver() {
      // Hack: check also whether the leg has a driverName. If so, it is a (rideshare) leg of a trip.
      // If not, it is a leg of a ride.
      return (
        this.travelMode === travelModes.RIDESHARE.mode && this.leg.driverName
      )
    },
  },
}

const headers = {
  WALK() {
    return `Lopen (${humanDistance(this.leg.distance)})`
  },
  CAR(step) {
    // Bit of a hack. Car is always first or last leg in a rideshare driver's view.
    // In case of three legs, the last leg is to get the driver at his destination.
    return step === 0 ? 'Vertrek' : 'Uitstappen'
  },
  RIDESHARE() {
    return 'Meerijden'
  },
  RAIL() {
    return `${this.leg.routeShortName} naar ${this.leg.to.label}`
  },
  BUS() {
    return `Reizen met bus ${this.leg.routeShortName}`
  },
  WAIT() {
    return `Even wachten.. (${Math.round(this.leg.duration / 60)} minuten)`
  },
  FINISH() {
    return 'Aankomst'
  },
  ARRIVAL() {
    return 'Aankomst'
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
  CAR(step) {
    return (step === 0 ? '' : 'Uitstappen op ') + this.leg.from.label
  },
  RIDESHARE() {
    return `Instappen vanaf ${this.leg.from.label}`
  },
  RAIL() {
    // add platform to departure and arrival
    return `${this.leg.from.label} perron ${this.leg.from.platformCode} - ${this.leg.to.label} perron ${this.leg.to.platformCode}`
  },
  BUS() {
    return `${this.leg.from.label} - ${this.leg.to.label}`
  },
  WAIT() {
    return ''
  },
  FINISH() {
    return this.leg.to.label
  },
  ARRIVAL() {
    // car arrival when sharing a ride
    return this.leg.from.label
  },
  SUBWAY() {
    return `${this.leg.from.label} - ${this.leg.to.label}`
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
.borderrs {
  background: url('../../assets/itinerarysolidlinerideshare.gif');
  background-position: center;
  background-repeat-x: no-repeat;
  height: 100%;
}

.active-map {
  @extend .selected-map;
}
</style>
