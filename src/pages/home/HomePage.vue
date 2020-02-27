<template>
  <content-pane>
    <v-row>
      <v-col>
        <span class="title">Mapbox below --></span>
        <route-map></route-map>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="3">
        <router-link to="/onboardingPage">
          <round-user-image></round-user-image>
        </router-link>
      </v-col>
      <v-col>
        <h1>
          {{ timeOfDayGreeting }},
          {{ user.fullName }}
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span>
          Welkom bij Netmobiel, dé mobiliteitsapp van de Achterhoek en
          omstreken.
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn large rounded block outlined color="primary" to="/howTo">
          Hoe werkt het?
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="updateMessages.length > 0">
      <v-col>
        <v-row>
          <v-col>
            <h4 class="netmobiel">Updates ({{ updateMessages.length }})</h4>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0">
            <update-card :update-message="updateMessages[0]"></update-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h4 class="netmobiel">Jouw activiteiten</h4>
      </v-col>
    </v-row>
    <v-row class="pt-0">
      <v-col v-if="rides.length === 0" class="pt-0">
        <v-row>
          <v-col class="pt-0">
            <span class="font-italic">
              Je hebt nog geen activiteiten gepland.
            </span>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              large
              rounded
              block
              depressed
              color="button"
              to="/modeSelection"
            >
              Direct aan de slag!
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col v-else class="pt-0">
        <v-row v-for="(ride, index) in rides" :key="index" xs12>
          <v-col class="py-0">
            <ride-card class="my-2" :ride="ride"></ride-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              large
              rounded
              block
              outlined
              color="primary"
              to="/tripsOverviewPage"
            >
              Bekijk alle activiteiten
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import RideCard from '@/components/rides/RideCard.vue'
import UpdateCard from '@/components/home/UpdateCard.vue'
import RoundUserImage from '@/components/common/RoundUserImage'

import moment from 'moment'
import RouteMap from '@/components/itinerary-details/RouteMap'

export default {
  components: {
    RouteMap,
    ContentPane,
    RideCard,
    UpdateCard,
    RoundUserImage,
  },
  computed: {
    user() {
      return this.$store.getters['ps/getUser']
    },
    rides() {
      //HACK: Only display first 3 rides.
      let sortedList = this.$store.getters['cs/getRides'].slice(0, 3)
      sortedList.sort((a, b) => {
        return new Date(a.departureTime) - new Date(b.departureTime)
      })
      return sortedList
    },
    timeOfDayGreeting() {
      let currentHour = moment().format('HH')

      if (currentHour < 12) {
        return 'Goedemorgen'
      } else if (currentHour < 18) {
        return 'Goedemiddag'
      } else {
        return 'Goedenavond'
      }
    },
    updateMessages() {
      return this.$store.getters['ui/getUpdateMessages']
    },
  },
  mounted() {
    this.$store.commit('ui/addAppClass', 'homepage')
    //TODO: How many cards do we want?
    this.$store.dispatch('cs/fetchRides', { offset: 0, maxResults: 2 })
  },
}
</script>

<style lang="scss">
h4.netmobiel {
  text-transform: uppercase;
  color: $color-primary;
}
</style>
