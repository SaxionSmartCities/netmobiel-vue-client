<template>
  <content-pane>
    <v-row>
      <v-col class="py-0">
        <ride-details :ride="ride" class="mb-4" />
      </v-col>
    </v-row>
    <v-row
      v-for="(leg, index) in generateSteps()"
      :key="index"
      class="mx-3 py-0"
    >
      <itinerary-leg :leg="leg" />
    </v-row>
    <v-row v-if="numBookings > 0">
      <v-col class="mx-1">
        <v-btn
          large
          rounded
          block
          outlined
          color="primary"
          @click="contactPassenger"
        >
          Stuur bericht naar passagier
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mb-2">
      <v-col>
        <h3 class="mb-2">Wijzigen</h3>
        <v-divider />
        <v-row @click="editRide">
          <v-col cols="3" class="text-center">
            <v-icon>fa-pencil-alt</v-icon>
          </v-col>
          <v-col>
            Wijzig deze rit
          </v-col>
        </v-row>
        <v-divider />
        <v-row @click="checkDeleteTrip()">
          <v-col cols="3" class="text-center">
            <v-icon>lock</v-icon>
          </v-col>
          <v-col>
            Reis annuleren
          </v-col>
        </v-row>
        <v-dialog v-model="warningDialog">
          <v-card>
            <v-card-title class="headline">
              Weet u dit zeker?
            </v-card-title>

            <v-card-text v-if="numBookings > 0">
              <p>
                Op dit moment heeft uw reis
                {{ numBookings }} boekingen, wilt u uw passagier(s) een reden
                geven waarom u de reis annuleert.
              </p>
              <v-textarea
                outlined
                name="input-7-4"
                label="Reden voor annulering"
                :value="cancelReason"
              ></v-textarea>
            </v-card-text>
            <v-card-text v-else>
              <p>
                Weet u zeker dat u deze rit wil annuleren?
              </p>
            </v-card-text>

            <v-card-actions>
              <v-btn text color="primary" @click="deleteTrip()">
                Ja
              </v-btn>

              <v-btn text color="primary" @click="warningDialog = false">
                Nee
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-divider />
      </v-col>
    </v-row>
    <contact-traveller-modal
      v-if="showContactTravellerModal"
      :show="showContactTravellerModal"
      :users="passengersInBookings"
      @close="showContactTravellerModal = false"
      @select="onTravellerSelectForMessage"
    ></contact-traveller-modal>
    <edit-ride-modal
      v-if="showEditRideModal"
      :show="showEditRideModal"
      @close="showEditRideModal = false"
    ></edit-ride-modal>
  </content-pane>
</template>

<script>
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import ContentPane from '@/components/common/ContentPane.vue'
import ContactTravellerModal from '@/components/itinerary-details/ContactTravellerModal'
import EditRideModal from '../../components/itinerary-details/EditRideModal'
import RideDetails from '@/components/itinerary-details/RideDetails.vue'
import * as uiStore from '@/store/ui'
import * as csStore from '@/store/carpool-service'

export default {
  name: 'RideDetailPage',
  components: {
    EditRideModal,
    ContactTravellerModal,
    ContentPane,
    ItineraryLeg,
    RideDetails,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      selectedLeg: null,
      warningDialog: false,
      cancelReason: '',
      showContactTravellerModal: false,
      showEditRideModal: false,
    }
  },
  computed: {
    passengersInBookings() {
      let bookings = !this.ride
        ? []
        : this.ride.bookings.map(booking => {
            return {
              name: `${booking.passenger.givenName} ${
                booking.passenger.familyName
              }`,
              passengerRef: booking.passengerRef,
              ...booking.passenger,
            }
          })
      return bookings
    },
    ride() {
      return csStore.getters.getSelectedRide
    },
    numBookings() {
      return !this.ride.bookings ? 0 : this.ride.bookings.length
    },
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  mounted() {
    // Fetch the ride on details page. This is needed for deeplinking.
    csStore.actions.fetchRide({ id: this.id })
  },
  methods: {
    generateSteps() {
      const { ride } = this
      if (!ride.id) return []
      let result = []
      let bookingDict = this.generateBookingDictionary(ride.bookings)
      for (let i = 0; i < this.ride.legs.length - 1; i++) {
        let currentLeg = this.ride.legs[i]
        this.setPassenger(currentLeg, bookingDict)
        let nextLeg = this.ride.legs[i + 1]
        result.push(currentLeg)

        // We won't show any waiting times < 60 sec -- should be made a config
        if (nextLeg.startTime - currentLeg.endTime > 60 * 1000) {
          // Add "WAIT" element (not from OTP).
          result.push({
            mode: 'WAIT',
            startTime: currentLeg.endTime,
            endTime: nextLeg.startTime,
            duration: (nextLeg.startTime - currentLeg.endTime) / 1000,
          })
        }
      }
      let lastLeg = this.ride.legs[this.ride.legs.length - 1]
      this.setPassenger(lastLeg, bookingDict)
      result.push(lastLeg)

      // Finally, we push the "FINISH" element (not from OTP)
      result.push({
        mode: 'FINISH',
        startTime: lastLeg.endTime,
        to: lastLeg.to,
      })
      return result
    },
    generateBookingDictionary(bookings) {
      let dict = []
      for (let i = 0; i < bookings.length; i++) {
        let map = bookings[i].legs.map(l => {
          let dictItem = { ...bookings[i].passenger }
          dictItem.legRef = l.legRef
          return dictItem
        })
        dict = dict.concat(map)
      }
      return dict
    },
    setPassenger(leg, bookingDict) {
      // TODO: Check why modality is not provided
      leg.mode = 'CAR'
      let passenger = bookingDict.find(b => b.legRef == leg.legRef)
      if (passenger) leg.passenger = passenger
    },
    onLegSelected(leg) {
      this.selectedLeg = leg
    },
    deleteTrip() {
      this.warningDialog = false
      csStore.actions.deleteRide({
        id: this.id,
        cancelReason: this.cancelReason,
      })
      this.$router.push('/tripsOverviewPage')
    },
    checkDeleteTrip() {
      this.warningDialog = true
    },
    async onTravellerSelectForMessage(event) {
      const tripContext = 'urn:nb:rs:ride:' + this.ride.id
      this.routeToConversation(tripContext, event)
    },
    contactPassenger() {
      if (this.passengersInBookings.length > 1) {
        this.showContactTravellerModal = true
      } else {
        this.onTravellerSelectForMessage(this.passengersInBookings[0])
      }
    },
    editRide() {
      this.showEditRideModal = true
    },
    routeToConversation(ctx, passengerProfile) {
      this.$store.dispatch('ms/fetchConversations').then(conversations => {
        const index = conversations.findIndex(
          conversation => conversation.context === ctx
        )
        let params = null
        if (index !== -1) {
          //So if the conversation already exists...
          params = conversations[index]
        } else {
          //If the conversation does not exists
          //Then create a ghost conversation
          params = {
            context: ctx,
            participants: [
              {
                managedIdentity: this.$store.getters['ps/getProfile'].id,
                urn: '',
              },
              {
                ...passengerProfile,
                urn: passengerProfile.passengerRef,
              },
            ],
          }
        }

        this.$router.push({
          name: `conversation`,
          params: params,
        })
      })
    },
  },
}
</script>
<style scoped>
.departure-date {
  text-transform: lowercase;
  padding-left: 0;
}
.departure-date::first-letter {
  text-transform: uppercase;
}
.equal-width {
  width: 100%;
}
.equal-width td {
  width: 14.14%;
  text-align: center;
}
</style>
