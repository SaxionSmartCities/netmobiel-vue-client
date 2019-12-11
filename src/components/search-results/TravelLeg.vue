<template>
  <v-layout column>
    <v-flex>
      <v-layout>
        <v-flex shrink>
          <v-icon
            class="text-primary"
            :class="{ 'v-icon-ride': leg.mode === 'CAR' }"
          >
            {{ getIcon }}
          </v-icon>
        </v-flex>
        <v-flex v-if="leg.mode === 'CAR'">
          <v-layout>
            <v-flex>
              <!-- <span class="car-description">
                {{
                  leg.ride.car.brand.charAt(0).toUpperCase() +
                    leg.ride.car.brand.substring(1).toLowerCase()
                }}
                {{ leg.ride.car.model }}
              </span> -->
            </v-flex>
          </v-layout>
        </v-flex>
        <!-- <v-flex v-if="leg.mode === 'BUS'"> Lijn {{ leg.route }} </v-flex> -->
      </v-layout>
    </v-flex>
    <v-flex pt-1>
      <div
        class="travel-line"
        :class="leg.mode === 'WALK' ? 'dotted' : ''"
      ></div>
    </v-flex>
  </v-layout>
</template>

<script>
import travelModes from '@/constants/travel-modes.js'

export default {
  name: 'TravelLeg',
  props: {
    currentRating: { type: Number, default: 0 },
    leg: {
      type: Object,
      default: function() {
        return {
          mode: undefined,
        }
      },
    },
  },
  data: function() {
    return {
      icon: 'directions_walk',
    }
  },
  computed: {
    getIcon: function() {
      return travelModes[this.leg.mode].icon
    },
  },
  methods: {},
}
</script>

<style lang="scss">
.travel-line {
  margin: 0px 5px 0px 0px;
  height: 5px;
  background: #c2c2c2;
  border-radius: 1000px;
}

.dotted {
  background: #ffffff;
  border-style: dotted;
  border-color: #c2c2c2;
}

.star {
  font-size: 0.6em;
  color: yellow;
}

.car-description {
  padding-left: 8px;
  font-size: 0.9em !important;
}
.v-icon-ride {
  color: $color-secondary !important;
}
</style>
