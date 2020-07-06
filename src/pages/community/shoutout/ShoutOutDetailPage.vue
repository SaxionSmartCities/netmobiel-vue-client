<template>
  <content-pane>
    <v-row>
      <v-col class="py-0">
        <v-row dense class="d-flex flex-column">
          <v-col><h1>Oproep details</h1></v-col>
          <v-col><v-divider /></v-col>
          <v-col class="py-0">
            <itinerary-summary
              :from="tripFromLabel"
              :to="tripToLabel"
              :date="trip.travelTime"
              :revenue="15"
            />
          </v-col>
          <v-col><v-divider /></v-col>
          <!-- Passenger -->
          <v-col v-if="isMine" class="mt-3">
            <v-row
              v-for="(leg, index) in generateShoutOutSteps()"
              :key="index"
              class="mx-3 py-0"
            >
              <itinerary-leg :leg="leg" />
            </v-row>
            <v-row dense class="d-flex flex-column">
              <v-col><v-divider /></v-col>
              <v-col>
                <h3>Rit aanbod</h3>
              </v-col>
              <v-col class="py-3">
                <em>Er zijn nog geen ritten aangeboden.</em>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pt-3 pb-0">
                <h3>Wijzigen</h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <itinerary-options
                  :selected-trip="trip"
                  @tripEdit="onTripEdit"
                  @tripCancelled="onTripCancelled"
                >
                </itinerary-options>
              </v-col>
            </v-row>
          </v-col>
          <!-- Chauffeur -->
          <v-col v-else>
            <v-row dense class="d-flex flex-column">
              <v-col v-if="planningStatus.status === 'PENDING'">
                <search-status />
              </v-col>
              <v-col v-else>
                <v-row>
                  <v-col v-if="planResult.plan.itineraries.length == 0" my-4>
                    Helaas, er is geen route gevonden!
                  </v-col>
                  <v-col v-else>
                    <v-row
                      v-for="(leg, index) in generateSteps(
                        planResult.plan.itineraries[0]
                      )"
                      :key="index"
                      class="mx-3 py-0"
                    >
                      <itinerary-leg :leg="leg" />
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="pt-3">
                <v-btn
                  :disabled="planningStatus.status != 'SUCCESS'"
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
              <v-col class="pt-1">
                <v-btn
                  :disabled="planningResponse.status != 'SUCCESS'"
                  large
                  rounded
                  block
                  outlined
                  color="primary"
                  to="/community"
                >
                  Bericht sturen naar passagier
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import ContentPane from '@/components/common/ContentPane.vue'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import ItineraryOptions from '@/components/itinerary-details/ItineraryOptions.vue'
import ItinerarySummary from '@/components/itinerary-details/ItinerarySummary.vue'
import SearchStatus from '@/components/search/SearchStatus.vue'
import {
  generateShoutOutDetailSteps,
  generateItineraryDetailSteps,
} from '@/utils/itinerary_steps.js'

export default {
  name: 'ShoutOutDetailPage',
  components: {
    ContentPane,
    ItineraryLeg,
    ItineraryOptions,
    ItinerarySummary,
    SearchStatus,
  },
  props: {
    id: { type: String, required: true },
    isMine: { type: Boolean, required: true },
  },
  data() {
    return {
      ride: null,
      showMap: false,
      planningResponse: {
        status: 'PENDING',
      },
    }
  },
  computed: {
    ...mapGetters({
      trip: 'is/getSelectedTrip',
      planningStatus: 'is/getPlanningStatus',
      planResult: 'is/getPlanningResults',
    }),
    tripFromLabel() {
      return this.trip?.from?.label
    },
    tripToLabel() {
      return this.trip?.to?.label
    },
    shoutout() {
      return {}
    },
  },
  mounted() {
    this.$store.dispatch('is/fetchShoutOut', { id: this.id })
    if (!this.isMine) {
      // Propose a ride to the chauffeur based on his address and the shoutout.
      const { address } = this.$store.getters['ps/getUser'].profile
      let payload = {
        id: this.id,
        from: {
          label: 'Woonplaats',
          latitude: address?.location?.coordinates[1],
          longitude: address?.location?.coordinates[0],
        },
      }
      this.$store.dispatch('is/submitShoutOutPlanningsRequest', payload)
    }
  },
  created() {
    this.$store.commit('ui/showBackButton')
  },
  methods: {
    generateShoutOutSteps() {
      return generateShoutOutDetailSteps(this.trip)
    },
    generateSteps(itinerary) {
      return generateItineraryDetailSteps(itinerary)
    },
    bookTrip() {
      //TODO:
    },
    onTripEdit() {
      const { searchPreferences } = this.$store.getters['ps/getProfile']
      let searchCriteria = {
        from: this.trip.from,
        to: this.trip.to,
        preferences: searchPreferences,
        travelTime: {
          when: this.trip.useAsArrivalTime
            ? moment(this.trip.latestArrivalTime)
            : moment(this.trip.earliestDepartureTime),
          arriving: this.trip.useAsArrivalTime,
        },
      }
      this.$store.commit('is/setSearchCriteria', searchCriteria)
      this.$store.dispatch('is/submitPlanningsRequest', searchCriteria)
      this.$router.push({ name: 'searchResults', editTrip: true })
    },
    onTripCancelled() {
      //TODO:
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
