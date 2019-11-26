<template>
  <v-layout column>
    <v-flex body-1>
      <v-layout row>
        <v-flex xs2>{{ time }}</v-flex>
        <v-flex xs1>
          <v-layout column align-center fill-height>
            <v-flex class="border">
              <div class="open-dot"></div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex v-if="leg.mode == 'CAR'" xs9 class="neg-margin-top">
          <v-layout>
            <v-flex
              ><v-img
                class="driverImage"
                :src="require('@/assets/profile_img.png')"
            /></v-flex>
            <v-flex xs12 pl-2>
              <span>{{ header }}</span
              ><br />
              <span class="caption"
                ><v-icon size="15">
                  map
                </v-icon>
                {{ description }}</span
              >
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex v-else xs9>{{ header }}</v-flex>
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
              <div
                v-if="leg.mode === 'WAIT'"
                class="borderstopped borderwidth"
              ></div>
              <div v-else class="border borderwidth"></div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex v-if="leg.mode !== 'CAR'" xs8 caption>
          <v-icon v-if="leg.mode !== 'WAIT' && leg.mode !== 'FINISH'" size="15">
            map
          </v-icon>
          {{ description }}
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment'
import travelModes from '@/constants/travel-modes.js'
import travelModesSurrogates from '@/constants/travel-modes-surrogates.js'
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
      if (travelModes[this.leg.mode] == undefined) {
        return travelModesSurrogates[this.leg.mode].icon
      } else {
        return travelModes[this.leg.mode].icon
      }
    },
    time: function() {
      return moment(parseInt(this.leg.startTime))
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
  CAR() {
    return `Meerijden met ${this.leg.agencyName}`
  },
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
    const validDepartureStep = this.leg.steps.find(step => !step.bogusName)
    const departureName =
      validDepartureStep !== undefined
        ? validDepartureStep.streetName
        : 'onbekend'

    const validArrivalStep = this.leg.steps
      .slice(0)
      .reverse()
      .find(step => !step.bogusName)
    const arrivalName =
      validArrivalStep !== undefined ? validArrivalStep.streetName : 'onbekend'

    return `${departureName} - ${arrivalName}`
  },
  CAR() {
    const dest = this.leg.to.name
    return 'vanaf ' + dest
  },
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

.driverImage {
  border-radius: 1000px;
  border: 1px solid #ccc;
  height: 40px;
  width: 40px;
}
.neg-margin-top {
  margin-top: -10px;
}
</style>
