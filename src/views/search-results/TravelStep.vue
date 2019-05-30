<template>
  <v-layout column>
    <v-flex>
      <v-layout>
        <v-flex shrink>
          <v-icon class="text-primary"><slot></slot></v-icon>
        </v-flex>
        <v-flex v-if="maxRating > 0">
          <v-layout>
            <v-flex v-for="(star, index) in starArray" :key="index" shrink>
              <v-icon v-if="star === 0" class="star">star_border</v-icon>
              <v-icon v-if="star === 1" class="star">star_half</v-icon>
              <v-icon v-if="star === 2" class="star">star</v-icon>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex pt-1>
      <div class="travel-line"></div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'TravelStep',
  props: {
    maxRating: { type: Number, default: 0 },
    currentRating: { type: Number, default: 0 },
  },
  data: function() {
    return {
      icon: 'directions_walk',
    }
  },
  computed: {
    starArray() {
      var result = []
      if (this.maxRating > 0) {
        for (var i = 0; i < Math.floor(this.currentRating); i++) {
          result.push(2)
        }

        if (Math.round(this.currentRating % 1) === 1) {
          result.push(1)
        }

        for (var j = result.length; j < this.maxRating; j++) {
          result.push(0)
        }
      }

      return result
    },
  },
}
</script>

<style lang="scss">
.travel-line {
  margin: 0px 5px 0px 0px;
  height: 5px;
  background: #c2c2c2;
  border-radius: 1000px;
}

.star {
  font-size: 0.6em;
  color: yellow;
}
</style>
