<template>
  <v-container>
    <v-layout column>
      <v-flex text-xs-right xs12 mb-5>
        <h4 class="faded">
          Ingelogd als: {{ user.givenName }} {{ user.familyName }} ({{
            user.email
          }})
        </h4>
      </v-flex>
      <v-flex v-if="rides.length > 0">
        <h5>Mijn geplande ritten</h5>
        <v-flex
          v-for="(ride, index) in rides"
          :key="index"
          my-1
          xs12
          class="travel-card"
        >
          <ride-card :ride="ride"></ride-card>
        </v-flex>
      </v-flex>
      <v-flex v-else>
        <h3>Hier staat nog niets!</h3>
        <p>Gebruik onderstaande knoppen om verder te gaan.</p>
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
      return this.$store.getters['cs/getRides']
    },
  },
}
</script>

<style lang="scss">
.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat) {
  background-color: $color-orange;
  color: white;
  text-transform: none;
}
</style>
