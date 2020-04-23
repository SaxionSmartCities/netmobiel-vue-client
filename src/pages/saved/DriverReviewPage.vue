<template>
  <content-pane>
    <v-row>
      <v-col>
        <v-stepper v-model="step" :elevation="0">
          <v-stepper-header>
            <v-stepper-step step="1"></v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="2"></v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3"></v-stepper-step>
          </v-stepper-header>
        </v-stepper>
      </v-col>
    </v-row>
    <template v-if="step === 1">
      <v-row>
        <v-col class="flex-column">
          <span>
            Heb je de reis naar <b>{{ title }}</b> gemaakt?
          </span>
          <v-checkbox
            v-model="review"
            label="Meteen een review achterlaten?"
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn @click="confirmTrip(false)">Nee</v-btn>
          <v-btn @click="confirmTrip(true)">ja</v-btn>
          <v-btn @click="$router.push({ name: 'home' })">Annuleren</v-btn>
        </v-col>
      </v-row>
    </template>
    <template v-if="step !== 1">
      <component
        :is="getCurrentStepComponent()"
        @tripNotMade="onTripNotMade"
        @rateTrip="onTripMade"
        @nextStep="step++"
        @back="step--"
      ></component>
    </template>
  </content-pane>
</template>

<script>
import ContentPane from '../../components/common/ContentPane'
import TripMade from '../review/TripMade'
import TripNotMade from '../review/TripNotMade'
export default {
  name: 'DriverReviewPage',
  components: { TripNotMade, TripMade, ContentPane },
  props: {
    title: { type: String, required: true },
  },
  data() {
    return {
      step: 1,
      isTripMade: null,
      review: true,
    }
  },
  methods: {
    setTripMade(value) {
      this.isTripMade = value
      //Open a model to confirm the user his answe
      this.review ? this.step++ : this.$router.push({ name: 'home' })
    },
    getCurrentStepComponent() {
      return this.isTripMade ? TripMade : TripNotMade
    },
    confirmTrip(value) {
      if (value)
        //Dispatch that the trip was made.
        this.setTripMade(true)
      else this.setTripMade(false)
    },
    onTripMade(rate) {
      console.log('the rate of the trip >> ', rate)
    },
    onTripNotMade(reason) {
      console.log('trip was not made: ', reason)
    },
  },
}
</script>

<style scoped></style>
