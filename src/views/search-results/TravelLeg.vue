<template>
  <v-layout column>
    <v-flex>
      <v-layout>
        <v-flex shrink>
          <v-icon class="text-primary">{{ getIcon }}</v-icon>
        </v-flex>
        <v-flex v-if="leg.mode === 'NETMOBIEL'">
          <v-layout>
            <v-flex v-for="(star, index) in starArray" :key="index" shrink>
              <v-icon v-if="star === 0" class="star">star_border</v-icon>
              <v-icon v-if="star === 1" class="star">star_half</v-icon>
              <v-icon v-if="star === 2" class="star">star</v-icon>
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
      maxRating: 3,
      icon: 'directions_walk',
    }
  },
  computed: {
    starArray() {
      var result = []

      for (var i = 0; i < Math.floor(this.currentRating); i++) {
        result.push(2)
      }

      if (Math.round(this.currentRating % 1) === 1) {
        result.push(1)
      }

      for (var j = result.length; j < this.maxRating; j++) {
        result.push(0)
      }

      return result
    },
    getIcon() {
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
        default:
          return 'warning'
      }
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
</style>
