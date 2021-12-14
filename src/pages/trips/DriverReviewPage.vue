<template>
  <content-pane>
    <v-row class="mb-5">
      <v-col class="py-0">
        <stepper v-model="step" :steps="3" />
      </v-col>
    </v-row>
    <template v-if="step === 1">
      <v-row>
        <v-col class="flex-column py-0">
          <h3>Bevestig jouw rit</h3>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <span class="body-2">
            Heb je op <em>{{ tripDepartureDate }}</em> om
            {{ tripDepartureTime }} een rit van
            <b>{{ trip.from.label }}</b> naar
            <b>{{ trip.to.label }}</b> gemaakt?
          </span>
          <v-checkbox
            v-model="review"
            class="body-2"
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
import TripMade from '../../components/review/TripMade'
import TripNotMade from '../../components/review/TripNotMade'
import moment from 'moment'
import Stepper from '@/components/other/Stepper'
import * as uiStore from '@/store/ui'
import * as psStore from '@/store/profile-service'
import * as isStore from '@/store/itinerary-service'
import * as UrnHelper from '@/utils/UrnHelper'

export default {
  name: 'DriverReviewPage',
  components: { Stepper, TripNotMade, TripMade, ContentPane },
  props: {
    tripContext: { type: String, required: true },
  },
  data() {
    return {
      step: 1,
      isTripMade: null,
      review: true,
      fromNotification: false,
      driverProfile: null,
    }
  },
  computed: {
    trip() {
      // When coming from a notification this function must look at the selectedTrip
      // Because the trip is fetched separately and will be stores separately (it won't be in the pastTrips array)
      return this.fromNotification
        ? isStore.getters.getSelectedTrip
        : isStore.getters.getPastTrips.find(
            (trip) => trip.tripRef === this.tripContext
          )
    },
    tripDepartureDate() {
      return moment(this.trip.itinerary.departureTime)
        .locale('nl')
        .format('dddd D MMMM')
    },
    tripDepartureTime() {
      return moment(this.trip.itinerary.departureTime)
        .locale('nl')
        .format('H:mm')
    },
    driverManagedIdentity() {
      const driverId = this.trip?.itinerary.legs[0].driverId
      if (driverId && UrnHelper.isUrn(driverId)) {
        const decodedUrn = UrnHelper.decodeUrn(driverId)
        if (decodedUrn.service === UrnHelper.NETMOBIEL_SERVICE.KEYCLOAK) {
          return decodedUrn.id
        }
      }
      return undefined
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    //When coming from a notification the state will be empty, so a query must be done to fetch the trip
    if (!this.trip) {
      this.fromNotification = true
      const tripId = this.tripContext.split(':').slice(-1)
      isStore.actions.fetchTrip({ id: tripId }).then(() => {
        this.fetchDriverProfile()
      })
    } else {
      this.fetchDriverProfile()
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
      // Send confirmation to backend.
      isStore.actions.confirmTrip({ id: this.trip.id })
      if (value) this.setTripMade(true)
      else this.setTripMade(false)
    },
    onTripMade(rate) {
      // For each compliment given do a call to the backend
      // Can be changed in the future to a call that possibly accepts array if >1 compliments can be given
      //FIXME The client cannot (and should not) determine the sender
      const { id, firstName, lastName } = psStore.getters.getProfile
      const sender = { id, firstName, lastName }
      const receiver = {
        id: this.driverManagedIdentity,
      }
      rate.compliments.map((compliment) =>
        psStore.actions.addUserCompliment({
          sender,
          receiver,
          complimentType: compliment,
        })
      )

      if (rate.feedbackMessage) {
        psStore.actions.addUserReview({
          sender,
          receiver,
          review: rate.feedbackMessage,
        })
      }
      this.$router.push({ name: 'tripReviewedPage' })
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
