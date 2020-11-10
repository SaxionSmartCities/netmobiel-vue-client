<template>
  <content-pane>
    <template v-slot:header>
      <v-row
        v-if="selectedTrip.state === 'CANCELLED'"
        class="cancelled-banner text-center py-1"
        dense
        no-gutters
      >
        <v-col>
          Deze rit is niet meer beschikbaar.
        </v-col>
      </v-row>
    </template>
    <v-row>
      <v-col class="py-0">
        <trip-details
          :trip="selectedTrip"
          :show-map="showMap"
          @closeMap="showMap = false"
        />
      </v-col>
    </v-row>
    <v-row v-if="!isShoutOut && hasRideShareDriver">
      <v-col>
        <v-btn
          large
          rounded
          outlined
          block
          mb-4
          depressed
          color="primary"
          @click="contactDriver"
        >
          Stuur bericht naar chauffeur
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="!isShoutOut">
      <v-col class="pt-0">
        <v-btn
          large
          rounded
          outlined
          block
          mb-4
          depressed
          color="primary"
          @click="showFullRouteOnMap()"
        >
          Bekijk op de kaart
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mb-0">
      <v-col class="pb-0">
        <h3>Wijzigen</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <itinerary-options
          :selected-trip="selectedTrip"
          @tripEdit="onTripEdit"
          @tripReplan="onTripReplan"
          @tripCancelled="onTripCancelled"
          @tripReview="onTripReview"
        >
        </itinerary-options>
      </v-col>
    </v-row>
    <contact-driver-modal
      v-if="showContactDriverModal"
      :show="showContactDriverModal"
      :users="drivers"
      @select="onDriverSelectForMessage"
      @close="showContactDriverModal = false"
    ></contact-driver-modal>
  </content-pane>
</template>

<script>
import moment from 'moment'
import ContentPane from '@/components/common/ContentPane.vue'
import TripDetails from '@/components/itinerary-details/TripDetails.vue'
import ItineraryOptions from '@/components/itinerary-details/ItineraryOptions.vue'
import ContactDriverModal from '@/components/itinerary-details/ContactDriverModal'
import travelModes from '@/constants/travel-modes.js'
import { generateItineraryDetailSteps } from '@/utils/itinerary_steps.js'
import * as uiStore from '@/store/ui'
import * as msStore from '@/store/message-service'
import * as csStore from '@/store/carpool-service'
import * as psStore from '@/store/profile-service'
import * as isStore from '@/store/itinerary-service'

export default {
  name: 'TripDetailPage',
  components: {
    ContactDriverModal,
    ContentPane,
    TripDetails,
    ItineraryOptions,
  },
  data() {
    return {
      showMap: false,
      showContactDriverModal: false,
    }
  },
  computed: {
    isShoutOut() {
      return false
    },
    hasRideShareDriver() {
      return this.getRideShareDriver !== null
    },
    drivers() {
      return this.selectedTrip.legs
        .filter(leg => leg.traverseMode === 'RIDESHARE')
        .map(leg => {
          return {
            name: leg.driverName,
            id: leg.driverId,
            tripContext: leg.tripId,
          }
        })
    },
    getRideShareDriver() {
      const rideshareMode = travelModes.RIDESHARE.mode
      const legs = this.selectedTrip.legs
      for (let i = 0; i < legs.length; i++) {
        if (legs[i].traverseMode === rideshareMode) {
          return legs[i].driverId
        }
      }
      return null
    },
    selectedTrip() {
      let trip = isStore.getters.getSelectedTrip
      trip.legs = generateItineraryDetailSteps(trip.itinerary)
      return trip
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    if (this.selectedTrip.state === 'SCHEDULED') {
      this.showConfirmationButton = false
    }
  },
  methods: {
    saveTrip() {
      const selectedTrip = isStore.getters.getSelectedTrip
      isStore.actions
        .storeSelectedTrip(selectedTrip)
        .then(() => this.$router.push('/tripPlanSubmitted'))
    },
    showFullRouteOnMap() {
      this.showMap = true
    },
    contactDriver() {
      if (this.selectedTrip.legs.length > 1) {
        //Open the modal
        this.showContactDriverModal = true
      } else {
        // You can directly push to the router
        const leg = this.selectedTrip.legs[0]
        this.onDriverSelectForMessage({
          name: leg.driverName,
          id: leg.driverId,
          tripContext: leg.tripId,
        })
      }
    },
    onTripReplan(trip) {
      isStore.mutations.setSearchCriteria({
        from: trip.from,
        to: trip.to,
      })
      this.$router.push('/search')
    },
    onTripReview(trip) {
      this.$router.push({
        name: 'reviewDriver',
        params: {
          tripContext: trip.tripRef,
          //TODO get drive name via profile service for the review text TripMade?
          // driverName: trip.
        },
      })
    },
    onTripCancelled(selectedTrip) {
      isStore.actions.deleteSelectedTrip({
        tripId: selectedTrip.tripId,
        displayWarning: true,
      })
      this.$router.push('/tripCancelledPage')
    },
    onTripEdit(trip) {
      const { from, to, itinerary, arrivalTimeIsPinned } = trip
      const { searchPreferences } = psStore.getters.getProfile
      let searchCriteria = {
        from,
        to,
        preferences: searchPreferences,
        travelTime: {
          when: arrivalTimeIsPinned
            ? moment(itinerary.arrivalTime)
            : moment(itinerary.departureTime),
          arriving: arrivalTimeIsPinned,
        },
      }
      isStore.mutations.setSearchCriteria(searchCriteria)
      isStore.actions.submitPlanningsRequest(searchCriteria)
      this.$router.push({
        name: 'searchResults',
        params: { tripId: String(this.selectedTrip.id) },
      })
    },
    onDriverSelectForMessage(event) {
      //The backend sends an urn for now so we need to split on ':' and get the last element
      //Maybe this will later change to an id and we can delete the split code... :)
      const driverUrn = event.id
      const driverId = driverUrn.split(':').splice(-1)[0]
      //Gets the driver his profile
      csStore.actions
        .fetchUser({
          userRef: driverId,
        })
        .then(driverProfile => {
          this.routeToConversation(event.tripContext, driverProfile)
        })
    },
    routeToConversation(ctx, driverProfile) {
      //Get the conversations and see if it already exists
      msStore.actions.fetchConversations().then(conversations => {
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
                managedIdentity: psStore.getters.getProfile.id,
                urn: '',
              },
              {
                ...driverProfile,
                urn: this.getRideShareDriver,
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

<style lang="scss" scoped></style>
