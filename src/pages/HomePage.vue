<template>
  <v-container class="carBackground">
    <v-layout column>
      <v-flex text-xs xs12 mb-2>
        <h3>Goededag, {{ user.fullName }}</h3>
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
  },
  mounted() {
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
.carBackground {
  background: url('../assets/autoscooter.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position-y: bottom;
}
</style>
