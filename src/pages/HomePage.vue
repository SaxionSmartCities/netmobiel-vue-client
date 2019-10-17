<template>
  <v-container>
    <v-layout column>
      <v-flex>
        <v-layout row pb-3>
          <v-flex>
            <v-img
              class="profileimage"
              :src="require('@/assets/profile_img.png')"
            />
          </v-flex>
          <v-flex text-xs-right>
            <v-layout fill-height justify-end column>
              <v-flex shrink>
                <h2>{{ timeOfDayGreeting }}, {{ user.fullName }}</h2>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-divider class="mb-2"></v-divider>
      <v-flex mt-2>
        <p>
          Welkom bij Netmobiel, dé mobiliteitsapp van de Achterhoek en
          omstreken.
        </p>
      </v-flex>
      <v-flex v-if="rides.length == 0" mt-3>
        <v-btn round block outline color="blue" to="/howTo">
          Hoe werkt het?
        </v-btn>
      </v-flex>
      <v-flex mt-3 mb-4>
        <v-btn large round block to="/modeSelection">
          Direct aan de slag!
        </v-btn>
      </v-flex>
      <v-flex v-if="rides.length > 0">
        <v-layout column>
          <v-flex>
            <h2 class="text-primary-uppercase">Jouw activiteiten</h2>
          </v-flex>
          <v-flex v-for="(ride, index) in rides" :key="index" xs12>
            <ride-card class="my-2" :ride="ride"></ride-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import RideCard from '@/components/rides/RideCard.vue'
import moment from 'moment'

export default {
  components: {
    RideCard,
  },
  computed: {
    user() {
      return this.$store.getters['ps/getUser']
    },
    rides() {
      //HACK: Only display first 3 rides.
      return this.$store.getters['cs/getRides'].slice(0, 3)
    },
    timeOfDayGreeting() {
      let currentHour = moment().format('HH')

      if (currentHour < 12) {
        return 'Goedemorgen'
      } else if (currentHour < 18) {
        return 'Goedemiddag'
      } else {
        return 'Goedeavond'
      }
    },
  },
  mounted() {
    this.$store.commit('ui/setAppClasses', 'homepage')
    this.$store.dispatch('cs/fetchRides')
  },
}
</script>

<style lang="scss">
.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat) {
  background-color: $color-orange;
  color: white;
  text-transform: none;
}
.negMarIcon {
  margin-bottom: -3px;
}

.profileimage {
  // margin-top: -100px;
  // position: absolute;
  height: 10vmax;
  width: 10vmax;
  // margin-left: -7.5vmax;
  // left: 50%;
  border-radius: 1000px;
  // margin-top: -10vmax;
  border: 2px solid white;
}
</style>
