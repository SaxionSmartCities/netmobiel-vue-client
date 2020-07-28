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
          <h3>Bevestig jouw reis</h3>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <span class="body-2">
            Heb je op <em>{{ tripDepartureDate }}</em> om
            {{ tripDepartureTime }} een reis van
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
        :driver-profile="driverProfile"
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
import Stepper from '@/components/other/Stepper'
import config from '@/config/config'
// import { maxCompliments } from '@/config/review/trip_made_config'

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
      this.$store.dispatch('is/fetchTrip', { id: tripId }).then(() => {
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
      //TODO: Send confirmation to backend.
      if (value) this.setTripMade(true)
      else this.setTripMade(false)
    },
    onTripMade(rate) {
      console.log('ID needs to be implemented to save to the backend', rate)
      const {
        id: myId,
        firstName: myFirstName,
        lastName: myLastName,
      } = this.$store.getters['ps/getProfile']
      const [
        receiverFirstName,
        receiverLastName,
      ] = this.trip.itinerary.legs[0].driverName.split(' ')
      //For each compliment given do a call to the backend
      //Can be changed in the future to a call that possibly accepts array if >1 compliments can be given
      const sender = {
        id: myId,
        firstName: myFirstName,
        lastName: myLastName,
      }
      const receiver = {
        //id: 'TODO NEEDS TO BE SET (CANNOT BE FETCHED FROM BACKEND YET...',
        firstName: receiverFirstName,
        lastName: receiverLastName,
      }
      // for (let i = 0; i < maxCompliments; i++) {
      // const compliment = rate.compliments[i]
      // this.$store.dispatch('ps/addUserCompliment', {
      // sender,
      // receiver,
      // complimentType: compliment
      // })
      // }
      console.log(
        'sender',
        sender,
        'receiver',
        receiver
        // 'compliment:',
        // compliment
      )
      if (rate.review) {
        // this.$store.dispatch('ps/addUserReview', {
        //   sender,
        //   receiver,
        //   review: rate.review,
        // })
      }
      this.$router.push({ name: 'tripReviewedPage' })
      this.step++
    },
    onTripNotMade(reason) {
      // eslint-disable-next-line
      console.log('trip was not made: ', reason)
      this.$router.push({ name: 'tripConfirmedPage' })
    },
    fetchDriverProfile() {
      //First fetch the driver properties via the carpool service
      this.$store
        .dispatch('cs/fetchUser', {
          userRef: this.trip.itinerary.legs[0].driverId,
        })
        .then(response => {
          //Fetch the profile of the driver via the profile-service (for the image)
          this.$store
            .dispatch('ps/fetchUserProfile', {
              profileId: response.managedIdentity,
            })
            .then(res => {
              this.driverProfile = {
                managedIdentity: response.managedIdentity,
                firstName: response.givenName,
                lastName: response.familyName,
                email: response.email,
                image: config.BASE_URL + res.image,
              }
            })
        })
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
