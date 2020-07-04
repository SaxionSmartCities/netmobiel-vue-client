<template>
  <content-pane>
    <v-row>
      <v-col class="py-0">
        <v-row dense class="d-flex flex-column">
          <v-col><h1>Reisdetails</h1></v-col>
          <v-col><v-divider /></v-col>
          <v-col class="py-0">
            <itinerary-summary
              :date="trip.travelTime"
              :duration="180"
              :revenue="15"
            />
          </v-col>
          <v-col><v-divider /></v-col>
          <v-col v-if="isMine">
            <v-row
              v-for="(leg, index) in generateSteps()"
              :key="index"
              class="mx-3 py-0"
            >
              <itinerary-leg :leg="leg" />
            </v-row>
          </v-col>
          <v-col v-else>
            chauffeur
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          large
          rounded
          block
          mb-4
          depressed
          color="button"
          @click="bookTrip"
        >
          Rit aanbieden
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pt-0">
        <v-btn large rounded block outlined color="primary" to="/community">
          Bericht sturen naar passagier
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import { mapGetters } from 'vuex'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import ContentPane from '@/components/common/ContentPane.vue'
import ItinerarySummary from '@/components/itinerary-details/ItinerarySummary.vue'
import { generateShoutOutDetailSteps } from '@/utils/itinerary_steps.js'

export default {
  name: 'ShoutOutDetailPage',
  components: { ContentPane, ItineraryLeg, ItinerarySummary },
  props: {
    id: { type: String, required: true },
    isMine: { type: Boolean, required: true },
  },
  data() {
    return {
      ride: null,
      showMap: false,
    }
  },
  computed: {
    ...mapGetters({
      trip: 'is/getSelectedTrip',
    }),
    shoutout() {
      return {}
    },
  },
  mounted() {
    this.$store.dispatch('is/fetchShoutOut', { id: this.id })
  },
  created() {
    this.$store.commit('ui/showBackButton')
  },
  methods: {
    bookTrip() {
      //TODO:
    },
    generateSteps() {
      return generateShoutOutDetailSteps(this.trip)
    },
  },
}
</script>
<style scoped>
.departure-date {
  text-transform: lowercase;
}
.departure-date::first-letter {
  text-transform: uppercase;
}
.equal-width {
  width: 100%;
}
.equal-width td {
  width: 14.14%;
  text-align: center;
}
</style>
