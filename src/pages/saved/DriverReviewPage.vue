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
        <v-col>
          <span>
            Heb je de reis naar <b>{{ title }}</b> gemaakt?
          </span>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn @click="setTripMade(false)">Nee</v-btn>
          <v-btn @click="setTripMade(true)">ja</v-btn>
        </v-col>
      </v-row>
    </template>
    <template v-if="step !== 1">
      <component @back="step--" :is="getCurrentStepComponent()"></component>
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
    }
  },
  methods: {
    setTripMade(value) {
      this.isTripMade = value
      this.step++
    },
    getCurrentStepComponent() {
      return this.isTripMade ? TripMade : TripNotMade
    },
  },
}
</script>

<style scoped></style>
