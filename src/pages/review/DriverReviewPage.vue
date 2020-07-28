<template>
  <content-pane>
    <v-row>
      <v-col class="py-0"> </v-col>
    </v-row>
    <template v-if="step === 1">
      <v-row>
        <v-col class="flex-column py-0">
          <h3>Bevestig jouw reis</h3>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <span>
            Heb je op <em>{{ tripDepartureDate }}</em> om
            {{ tripDepartureTime }} een reis van
            <b>{{ trip.from.label }}</b> naar
            <b>{{ trip.to.label }}</b> gemaakt?
          </span>
          <v-checkbox
            v-model="review"
            label="Ik wil ook een review achterlaten?"
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            block
            rounded
            depressed
            color="button"
            @click="confirmTrip(true)"
          >
            Ja
          </v-btn>
          <v-btn
            block
            class="my-2"
            rounded
            outlined
            depressed
            color="primary"
            @click="confirmTrip(false)"
          >
            Nee
          </v-btn>

          <!-- This button seems redundant because we already have a back
            button (see top left corner)
          <v-btn
            block
            rounded
            outlined
            depressed
            color="primary"
            @click="$router.push({ name: 'tripsOverviewPage' })"
          >
            Ga terug
          </v-btn> -->
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <component
        :is="getCurrentStepComponent()"
        v-if="trip"
        :trip="trip"
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
import moment from 'moment'

export default {
  name: 'DriverReviewPage',
  components: { TripNotMade, TripMade, ContentPane },
  props: {
    tripContext: { type: String, required: true },
  },
  data() {
    return {
      step: 1,
      isTripMade: null,
      review: true,
      fromNotification: false,
    }
  },
  computed: {
    trip() {
      // When coming from a notification this function must look at the selectedTrip
      // Because the trip is fetched separately and will be stores separately (it won't be in the pastTrips array)
      return this.fromNotification
        ? this.$store.getters['is/getSelectedTrip']
        : this.$store.getters['is/getPastTrips'].find(
            trip => trip.tripRef === this.tripContext
          )
    },
    tripDepartureDate() {
      return moment(this.trip.departureTime)
        .locale('nl')
        .format('dddd D MMMM')
    },
    tripDepartureTime() {
      return moment(this.trip.departureTime)
        .locale('nl')
        .format('H:mm')
    },
  },
  created() {
    this.$store.commit('ui/showBackButton')
    //When coming from a notification the state will be empty, so a query must be done to fetch the trip
    if (!this.trip) {
      this.fromNotification = true
      const tripId = this.tripContext.split(':').slice(-1)
      this.$store.dispatch('is/fetchTrip', { id: tripId })
    }
  },
  methods: {
    setTripMade(value) {
      this.isTripMade = value
      this.review || !this.isTripMade
        ? this.step++
        : this.$router.push({ name: 'tripConfirmedPage' })
    },
    getCurrentStepComponent() {
      return this.isTripMade ? TripMade : TripNotMade
    },
    confirmTrip(value) {
      //TODO: Send confirmation to backend.
      if (value) this.setTripMade(true)
      else this.setTripMade(false)
    },
    onTripMade(rate) {
      //TODO: Send rating to backend.
      console.log('feedback value', rate)
      // this.$router.push({ name: 'tripReviewedPage' })
      this.step++
    },
    onTripNotMade(reason) {
      // eslint-disable-next-line
      console.log('trip was not made: ', reason)
      this.$router.push({ name: 'tripConfirmedPage' })
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
