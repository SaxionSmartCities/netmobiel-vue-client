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
      <v-flex v-for="(journey, index) in journeys" :key="index">
        <travel-card class="mt-2" :journey="journey"></travel-card>
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
      journeys: [
        {
          journeyId: 123,
          legs: [
            {
              id: 0,
              mode: { type: 'bus', line: 144 },
              time: 5,
            },
            {
              id: 1,
              mode: {
                type: 'car',
                driver: {
                  name: 'Henk',
                  rating: 3.0,
                },
              },

              time: 20,
            },
            {
              id: 2,
              mode: { type: 'walk' },
              time: 10,
            },
          ],
          cost: 20,
          departureTime: '09:40',
        },
        {
          journeyId: 456,
          legs: [
            {
              id: 0,
              mode: { type: 'walk' },
              time: 5,
            },
            {
              id: 1,
              mode: {
                type: 'car',
                driver: {
                  name: 'Coby',
                  rating: 1.2,
                },
              },

              time: 10,
            },
            {
              id: 2,
              mode: { type: 'bus', line: 144 },
              time: 35,
            },
          ],
          cost: 5,
          departureTime: '09:20',
        },
        {
          journeyId: 457,
          legs: [
            {
              id: 0,
              mode: { type: 'walk' },
              time: 5,
            },
            {
              id: 1,
              mode: {
                type: 'car',
                driver: {
                  name: 'Bert',
                  rating: 2.5,
                },
              },

              time: 15,
            },
            {
              id: 2,
              mode: { type: 'bus', line: 144 },
              time: 5,
            },
            {
              id: 3,
              mode: {
                type: 'car',
                driver: {
                  name: 'Laura',
                  rating: 1.8,
                },
              },

              time: 10,
            },
          ],
          cost: 5,
          departureTime: '09:45',
        },
        {
          journeyId: 789,
          legs: [
            {
              id: 0,
              mode: {
                type: 'taxi',
                driver: {
                  name: 'Netmobiel chauffeur',
                  rating: 3.0,
                },
              },

              time: 35,
            },
          ],
          cost: 100,
          departureTime: '09:10',
        },
      ],
    }
  },
}
</script>

<style lang="scss"></style>
