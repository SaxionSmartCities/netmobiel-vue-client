<template>
  <div>
    <v-icon
      class="text-primary"
      :class="{ 'v-icon-ride': leg.traverseMode === 'RIDESHARE' }"
    >
      {{ getIcon }}
    </v-icon>
    <div
      class="travel-line"
      :class="{
        dotted: leg.traverseMode === 'WALK',
      }"
    />
  </div>
</template>

<script>
import travelModes from '@/constants/travel-modes.js'

export default {
  name: 'TravelLeg',
  props: {
    currentRating: { type: Number, default: 0 },
    leg: {
      type: Object,
      default: function () {
        return {
          mode: undefined,
        }
      },
    },
    isCancelled: { type: Boolean, required: false, default: false },
  },
  computed: {
    getIcon() {
      return travelModes[this.leg.traverseMode]?.icon
    },
  },
}
</script>

<style lang="scss">
.travel-line {
  margin: 4px 5px 0px 0px;
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
.cancelled-leg {
  background: $color-alertRed !important;
}
</style>
