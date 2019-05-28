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
      <v-flex>
        <travel-card v-for="i in 2" :key="i" class="mt-2"></travel-card>
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
}
</script>

<style lang="scss"></style>
