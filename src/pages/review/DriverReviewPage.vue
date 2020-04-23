<template>
  <content-pane>
    <v-row>
      <v-col>
        <v-stepper v-model="step" class="stepper" :elevation="0">
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
          <v-btn block rounded color="button" @click="confirmTrip(true)">
            ja
          </v-btn>
          <v-btn
            block
            class="my-2"
            rounded
            outlined
            color="primary"
            @click="confirmTrip(false)"
          >
            Nee
          </v-btn>

          <v-btn
            block
            outlined
            rounded
            color="primary"
            @click="$router.push({ name: 'tripsOverviewPage' })"
          >
            Annuleren
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <template v-else>
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
import TripMade from './TripMade'
import TripNotMade from './TripNotMade'
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
  created() {
    this.$store.commit('ui/showBackButton')
  },
  methods: {
    setTripMade(value) {
      this.isTripMade = value
      this.review ? this.step++ : this.$router.push({ name: 'home' })
    },
    getCurrentStepComponent() {
      return this.isTripMade ? TripMade : TripNotMade
    },
    confirmTrip(value) {
      if (value) this.setTripMade(true)
      else this.setTripMade(false)
    },
    onTripMade(rate) {
      console.log('the rate of the trip >> ', rate)
      this.$router.push({ name: 'home' })
    },
    onTripNotMade(reason) {
      console.log('trip was not made: ', reason)
      this.$router.push({ name: 'home' })
    },
  },
}
</script>

<style lang="scss" scoped>
.stepper {
  box-shadow: none;
}
.v-stepper__step {
  &:first-child {
    padding-left: 0;
  }
  &:last-child {
    padding-right: 0;
  }
}
</style>
