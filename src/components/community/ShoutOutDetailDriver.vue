<template>
  <v-row dense>
    <v-col>
      <v-row>
        <v-col>
          <h4>Jouw aanboden rit:</h4>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <itinerary-leg
            v-for="(leg, index) in generateSteps"
            :key="index"
            :leg="leg"
            :showicon="true"
            :showdottedline="false"
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <v-btn
            large
            rounded
            outlined
            block
            depressed
            color="primary"
            @click="onShowMap"
          >
            Bekijk op de kaart
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="d-flex flex-column">
        <v-col>
          <h3>Wijzigen</h3>
        </v-col>
        <v-col>
          <itinerary-options :options="options" />
        </v-col>
      </v-row>
    </v-col>
    <v-dialog v-model="warningDialog">
      <v-card class="py-1 px-3">
        <v-card-title class="headline"> Verwijder rit met aanbod </v-card-title>
        <v-card-text>
          <v-row class="d-flex flex-column">
            <v-col class="py-0">
              <p class="mb-1">
                Weet je zeker dat je het aanbod wilt intrekken? Geef in een
                persoonlijke boodschap aan waarom je het aanbod intrekt.
              </p>
            </v-col>
            <v-col class="py-0">
              <v-textarea
                outlined
                :auto-grow="true"
                rows="3"
                label="Reden voor intrekking"
                hide-details="true"
                :value="cancelReason"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row class="d-flex flex-column py-2">
            <v-col class="py-1">
              <v-btn
                large
                rounded
                block
                depressed
                color="button"
                @click="deleteRide"
              >
                Aanbod Intrekken
              </v-btn>
            </v-col>
            <v-col class="py-1">
              <v-btn
                large
                rounded
                outlined
                block
                depressed
                color="primary"
                @click="cancelDialog"
              >
                Aanbod toch bewaren
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import ItineraryOptions from '@/components/itinerary-details/ItineraryOptions.vue'
import { generateShoutOutDetailSteps } from '@/utils/itinerary_steps.js'
import * as csStore from '@/store/carpool-service'

export default {
  name: 'ShoutOutDetailDriver',
  components: {
    ItineraryLeg,
    ItineraryOptions,
  },
  props: {
    ride: { type: Object, required: true },
  },
  data() {
    return {
      warningDialog: false,
      cancelReason: '',
      options: [
        {
          icon: 'fa-times-circle',
          label: 'Aanbod intrekken',
          callback: this.onCancelOffer,
        },
      ],
    }
  },
  computed: {
    generateSteps() {
      let steps = []
      if (this.ride?.rideRef) {
        steps = generateShoutOutDetailSteps(undefined, this.ride, true)
      }
      return steps
    },
  },
  methods: {
    cancelDialog() {
      this.warningDialog = false
    },
    onCancelOffer() {
      this.warningDialog = true
    },
    deleteRide() {
      this.warningDialog = false
      csStore.actions
        .deleteRide({
          id: this.ride.rideRef,
          reason: this.cancelReason,
          scope: 'this',
        })
        .then(() => this.$router.go(-1))
    },
    onShowMap() {
      this.$emit('show-map-proposal')
    },
  },
}
</script>
