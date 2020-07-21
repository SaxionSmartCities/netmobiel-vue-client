<template>
  <content-pane>
    <v-row>
      <v-col class="py-0">
        <trip-details
          :trip="selectedTrip"
          :show-map="showMap"
          @closeMap="showMap = false"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="py-0">
        <corona-check
          :value="coronaCheck"
          class="mb-2"
          @done="onCoronaCheckDone"
        ></corona-check>
        <v-btn
          v-show="showSection"
          large
          rounded
          block
          mb-4
          depressed
          color="button"
          :disabled="!passedCoronaCheck"
          @click="saveTrip"
        >
          Deze reis bevestigen
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          large
          rounded
          outlined
          block
          mb-4
          depressed
          color="primary"
          @click="showFullRouteOnMap()"
        >
          bekijk op de kaart
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import TripDetails from '@/components/itinerary-details/TripDetails.vue'
import CoronaCheck from '@/components/common/CoronaCheck'

export default {
  name: 'ItineraryDetailPage',
  components: {
    CoronaCheck,
    ContentPane,
    TripDetails,
  },
  data() {
    return {
      showMap: false,
      showConfirmationButton: true,
    }
  },
  computed: {
    selectedTrip() {
      return this.$store.getters['is/getSelectedTrip']
    },
    showSection() {
      return this.showConfirmationButton
    },
    coronaCheck() {
      return this.$store.getters['ps/getCoronaCheck']
    },
    passedCoronaCheck() {
      return this.$store.getters['ps/passedCoronaCheck']
    },
  },
  created() {
    this.$store.commit('ui/showBackButton')
    if (this.selectedTrip.state === 'SCHEDULED') {
      this.showConfirmationButton = false
    }
  },
  methods: {
    saveTrip() {
      this.$store
        .dispatch('is/storeSelectedTrip', this.selectedTrip)
        .then(() => this.$router.push('/tripPlanSubmitted'))
    },
    showFullRouteOnMap() {
      this.showMap = true
    },
    onCoronaCheckDone(val) {
      this.$store.commit('ps/setCoronaCheck', val)
    },
  },
}
</script>

<style lang="scss"></style>
