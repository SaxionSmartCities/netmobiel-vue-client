<template>
  <content-pane>
    <v-row class="flex-column">
      <v-col>
        <h1>Rit heeft niet plaatsgevonden</h1>
      </v-col>
      <v-col> Wat is de reden? </v-col>
      <v-col>
        <v-radio-group v-model="tripNotMadeReason" class="mt-1" column>
          <v-radio
            v-for="reason in tripNotMadeReasons"
            :key="reason.value"
            :label="reason.title"
            :value="reason.value"
          ></v-radio>
        </v-radio-group>
      </v-col>
      <v-col>
        <v-btn
          class="my-2"
          large
          block
          rounded
          color="button"
          depressed
          :disabled="!tripNotMadeReason"
          @click="tripNotMade()"
        >
          Opslaan
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import constants from '@/constants/constants'
import ContentPane from '@/components/common/ContentPane.vue'
import * as uiStore from '@/store/ui'
import * as isStore from '@/store/itinerary-service'

export default {
  name: 'TripRejectedPage',
  components: {
    ContentPane,
  },
  props: {
    tripId: { type: String, required: true },
  },
  data() {
    return {
      tripNotMadeReasons: constants.PASSENGER_TRIP_NOT_MADE_REASONS,
      tripNotMadeReason: null,
    }
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  methods: {
    tripNotMade() {
      isStore.actions.rejectTrip({
        id: this.tripId,
        reasonCode: this.tripNotMadeReason,
      })
      this.$router.push({
        name: 'tripReviewedPage',
        params: { otherRole: 'driver' },
      })
    },
  },
}
</script>

<style scoped></style>
