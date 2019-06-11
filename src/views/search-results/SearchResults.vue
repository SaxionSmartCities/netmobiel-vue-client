<template>
  <v-container>
    <v-layout column>
      <v-flex><h1>Reisopties</h1></v-flex>
      <v-flex mt-2>
        <v-layout>
          <v-flex text-uppercase xs8>datum</v-flex>
          <v-flex>sorteerknop</v-flex>
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
    return {}
  },
  computed: {
    getItineraries() {
      return this.$store.getters.getItineraries
    },
  },
}

// function stripData(input) {
//   console.log('stripData')
//   console.log(input)

//   var result = []

//   for (var i = 0; i < input.length; i++) {
//     let currentItinerary = input[i]

//     result.push(stripItineraryData(currentItinerary))
//   }

//   console.log(result)
//   return result
// }

// function stripItineraryData(input) {
//   console.log('stripItineraryData')
//   console.log(input)
//   var result = {
//     duration: input.duration,
//     startTime: input.startTime,
//     endTime: input.endTime,
//     legs: [],
//   }

//   for (var i = 0; i < input.legs.length; i++) {
//     result.legs.push(stripLegData(input.legs[i]))
//   }

//   console.log(result)
//   return result
// }

// function stripLegData(input) {
//   console.log('stripLegData')
//   console.log(input)
//   return {
//     duration: input.duration,
//     mode: input.mode,
//   }
// }
</script>

<style lang="scss"></style>
