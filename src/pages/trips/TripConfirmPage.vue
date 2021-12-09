<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Rit geslaagd?</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card outlined class="px-1">
          <v-row class="d-flex flex-column">
            <v-col>
              <h4 class="netmobiel">{{ travelDate }}</h4>
            </v-col>
            <v-col>
              <itinerary-leg
                v-for="(leg, index) in generateSteps"
                :key="index"
                :step="index"
                :leg="leg"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          large
          rounded
          outlined
          block
          depressed
          color="primary"
          :disabled="processing"
          @click="reject"
        >
          Rit heeft niet plaatsgevonden
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          large
          block
          rounded
          depressed
          color="button"
          :disabled="processing"
          @click="confirm"
        >
          Bevestigen
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import moment from 'moment'
import ContentPane from '@/components/common/ContentPane.vue'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import { generateItineraryDetailSteps } from '@/utils/itinerary_steps.js'
import * as uiStore from '@/store/ui'
import * as isStore from '@/store/itinerary-service'

export default {
  name: 'TripConfirmPage',
  components: {
    ContentPane,
    ItineraryLeg,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      processing: false,
    }
  },
  computed: {
    trip() {
      return isStore.getters.getSelectedTrip
    },
    travelDate() {
      const departureTime = this.trip?.itinerary?.departureTime
      if (departureTime) {
        return moment(departureTime).locale('nl').format('dddd DD MMMM')
      }
      return 'Onbekend'
    },
    generateSteps() {
      return generateItineraryDetailSteps(this.trip.itinerary)
    },
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  mounted() {
    if (this.id) {
      isStore.actions.fetchTrip({ id: this.id })
    }
  },
  methods: {
    confirm() {
      this.processing = true
      isStore.actions
        .confirmTrip({ id: this.id })
        .then(() => this.$router.push({ name: 'tripConfirmedPage' }))
    },
    reject() {
      this.processing = true
      this.$router.push({
        name: 'tripNotMade',
        params: { id: this.id },
      })
    },
  },
}
</script>
<style lang="scss" scoped>
h4.netmobiel {
  text-transform: uppercase;
  color: $color-primary;
}
</style>
