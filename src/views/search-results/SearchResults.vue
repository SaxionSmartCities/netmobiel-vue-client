<template>
  <v-container>
    <v-layout column>
      <v-flex><h1>Reisopties</h1></v-flex>
      <v-flex mt-2>
        <v-layout>
          <v-flex text-uppercase xs8>datum</v-flex>
          <v-flex @click="changeSort()">{{
            sortModi[selectedModus].name
          }}</v-flex>
        </v-layout>
      </v-flex>
      <v-flex v-for="(itinerary, index) in getItineraries" :key="index">
        <travel-card class="mt-2" :journey="itinerary"></travel-card>
      </v-flex>
      <v-flex mt-3>
        <v-layout column>
          <v-flex>
            <v-layout pa-2>
              <v-flex xs2>
                <v-icon>fa-volume-up</v-icon>
              </v-flex>
              <v-flex>Plaats oproep in de community</v-flex>
            </v-layout>
          </v-flex>
          <v-flex mt-3 mb-3>
            <v-layout pa-2>
              <v-flex xs2>
                <v-icon>phone_in_talk</v-icon>
              </v-flex>
              <v-flex>Bel de ZOOV regiotaxi</v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TravelCard from '@/views/search-results/TravelCard.vue'

export default {
  name: 'SearchResults',
  components: {
    TravelCard,
  },
  data: function() {
    return {
      sortModi: [
        { name: 'Vertrektijd', function: this.sortByStartTime },
        { name: 'Tijdsduur', function: this.sortByDuration },
        { name: 'Overstappen', function: this.sortByTransfers },
      ],
      selectedModus: 0,
    }
  },
  computed: {
    getItineraries() {
      return this.$store.getters.getItineraries
    },
  },
  methods: {
    sortByDuration: function(a, b) {
      return a.duration - b.duration
    },
    sortByTransfers: function(a, b) {
      return a.legs.length - b.legs.length
    },
    sortByStartTime: function(a, b) {
      return a.startTime - b.startTime
    },
    changeSort: function() {
      this.selectedModus = (this.selectedModus + 1) % this.sortModi.length
      this.$store.commit(
        'sortItineraries',
        this.sortModi[this.selectedModus].function
      )
    },
  },
}
</script>

<style lang="scss"></style>
