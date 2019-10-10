<template>
  <v-container>
    <v-layout>
      <v-flex>
        <v-img
          class="profileimage"
          :src="require('@/assets/profile_img.png')"
        />
      </v-flex>
    </v-layout>
    <v-layout mt-5 pt-3 column>
      <v-flex text-xs xs12 mb-2>
        <h3>{{ timeOfDayGreeting }}, {{ user.fullName }}</h3>
      </v-flex>
      <v-divider class="mb-2"></v-divider>
      <v-flex v-if="rides.length > 0" mt-2>
        <h2 class="text-primary-uppercase">Mijn aangeboden ritten</h2>
        <v-flex
          v-for="(ride, index) in rides"
          :key="index"
          my-2
          xs12
          class="travel-card"
        >
          <ride-card :ride="ride"></ride-card>
        </v-flex>
      </v-flex>
      <v-flex v-else mt-2>
        <p>
          Welkom bij Netmobiel, dé mobiliteitsapp van de Achterhoek en
          omstreken.
        </p>
        <p>
          Het menu onderin is de manier om door de app heen te navigeren, hier
          kun je:
        </p>
        <p>
          <v-icon class="mr-2 negMarIcon">commute</v-icon>
          <span>Een reis plannen</span>
        </p>
        <p>
          <v-icon class="mr-2 negMarIcon">favorite</v-icon> Je bewaarde reizen
          zien
        </p>
        <p>
          <v-icon class="mr-2 negMarIcon">directions_car</v-icon> Een reis
          plannen
        </p>
        <p>
          <v-icon class="mr-2 negMarIcon">person</v-icon> Je profielinstellingen
          wijzigen
        </p>
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
  margin-top: -100px;
  position: absolute;
  height: 15vmax;
  width: 15vmax;
  margin-left: -7.5vmax;
  left: 50%;
  border-radius: 1000px;
  margin-top: -10vmax;
  border: 2px solid white;
}
</style>
