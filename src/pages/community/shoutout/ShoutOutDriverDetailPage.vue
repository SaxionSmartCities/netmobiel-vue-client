<template>
  <content-pane>
    <v-row>
      <v-col class="py-0">
        <v-row dense class="d-flex flex-column">
          <v-col>
            <h1>Oproep details</h1>
          </v-col>
          <v-col><v-divider /></v-col>
          <v-col class="py-0">
            <itinerary-summary-list :items="itinerarySummaryItems" />
          </v-col>
          <v-col><v-divider /></v-col>
          <v-col>
            <v-row dense class="d-flex flex-column">
              <v-col v-if="hasTravelOffer">
                <shout-out-detail-driver :ride="ride" />
              </v-col>
              <v-col v-else>
                <shout-out-travel-proposal
                  :trip="trip"
                  :offer="travelOffer"
                  :editing="editDepart"
                  @proposeTravelOffer="onProposeTravelOffer"
                  @confirmTravelOffer="onConfirmTravelOffer"
                  @proposalCancel="onProposalCancel"
                  @updateProposal="onProposalUpdate"
                  @locationUpdate="onLocationUpdate"
                  @locationReset="onLocationReset"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import moment from 'moment'
import { getDistance } from 'geolib'
import ContentPane from '@/components/common/ContentPane.vue'
import ItinerarySummaryList from '@/components/itinerary-details/ItinerarySummaryList.vue'
import ShoutOutDetailDriver from '@/components/community/ShoutOutDetailDriver.vue'
import ShoutOutTravelProposal from '@/components/community/ShoutOutTravelProposal.vue'
import { beforeRouteLeave, beforeRouteEnter } from '@/utils/navigation.js'
import { formatDateTimeLong } from '@/utils/datetime.js'
import * as uiStore from '@/store/ui'
import * as csStore from '@/store/carpool-service'
import * as psStore from '@/store/profile-service'
import * as gsStore from '@/store/geocoder-service'
import * as isStore from '@/store/itinerary-service'

export default {
  name: 'ShoutOutDriverDetailPage',
  components: {
    ContentPane,
    ItinerarySummaryList,
    ShoutOutDetailDriver,
    ShoutOutTravelProposal,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      editDepart: false,
    }
  },
  computed: {
    ...{
      profile: () => psStore.getters.getProfile,
      trip: () => isStore.getters.getSelectedTrip,
      ride: () => csStore.getters.getSelectedRide,
      planningRequest: () => isStore.getters.getPlanningRequest,
      planningStatus: () => isStore.getters.getPlanningStatus,
      planResult: () => isStore.getters.getPlanningResults,
    },
    itinerarySummaryItems() {
      let result = []
      const { travelTime } = this.trip
      if (travelTime) {
        result.push({ label: 'Datum', value: formatDateTimeLong(travelTime) })
      }
      result.push({ label: 'Reisduur', value: this.tripDuration })
      const hasCoordinates =
        this.trip.from !== undefined && this.trip.to !== undefined
      const kilometers = hasCoordinates
        ? getDistance(this.trip.from, this.trip.to, 1000) / 1000
        : 'Onbekend'
      result.push({ label: 'Afstand', value: `${kilometers} km` })
      result.push({ label: 'Reiziger', value: this.travellerName })
      return result
    },
    tripDuration() {
      let reisduur = 'Onbekend'
      if (this.itinerary?.duration) {
        const { duration } = this.itinerary
        reisduur = `${Math.round(duration / 60)} minuten`
      }
      return reisduur
    },
    travellerName() {
      if (this.trip?.traveller) {
        return `${this.trip.traveller.givenName} ${this.trip.traveller.familyName}`
      }
      return 'Onbekend'
    },
    hasTravelOffer() {
      const itineraries = this.trip.itineraries || []
      const fullName = psStore.getters.getUser.fullName
      for (let itinerary of itineraries) {
        const found = itinerary?.legs.find(l => l.driverName === fullName)
        if (found) {
          return found.state !== 'CANCELLED'
        }
      }
      return false
    },
    itinerary() {
      //TODO: ?
      return null
    },
    travelOffer() {
      return isStore.getters.getPlanningRequest.result
    },
  },
  watch: {
    trip(newValue) {
      //HACK: Find the first leg in the first itinerary for the ride id.
      for (const itinerary of newValue.itineraries) {
        if (itinerary.legs.length > 0) {
          const rideId = itinerary.legs[0].tripId
          csStore.actions.fetchRide({ id: rideId })
          break
        }
      }
    },
    editDepart(newValue) {
      // Note: BeforeRouteEnter fires after mount so we will watch the editDepart value
      // here to get the updated value.
      const { ridefrom } = gsStore.getters.getPickedLocation
      if (newValue && ridefrom) {
        const time = isStore.getters.getShoutoutPlanTime
        const location = {
          label: ridefrom.title,
          latitude: ridefrom.position[0],
          longitude: ridefrom.position[1],
        }
        this.fetchShoutOutPlan(time, location)
        gsStore.mutations.setGeoLocationPicked({
          field: 'ridefrom',
          suggestion: null,
        })
      }
    },
  },
  mounted() {
    isStore.mutations.clearPlanningResults()
    isStore.actions.fetchShoutOut({ id: this.id })
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  beforeRouteEnter: beforeRouteEnter({
    editDepart: editing => editing || false,
  }),
  beforeRouteLeave: beforeRouteLeave({
    editDepart: editing => editing || false,
  }),
  methods: {
    fetchShoutOutPlan(time, location) {
      let request = {
        id: this.id,
        from: location,
        travelTime: { when: time, arriving: false },
      }
      isStore.actions.submitShoutOutPlanningsRequest(request)
    },
    onProposeTravelOffer() {
      isStore.mutations.clearPlanningResults()
      const { address } = this.profile
      const from = {
        label: 'Thuis',
        latitude: address?.location?.coordinates[1],
        longitude: address?.location?.coordinates[0],
      }
      let request = {
        id: this.id,
        from: from,
        travelTime: {
          when: moment(this.trip.travelTime),
          arriving: this.trip.useAsArrivalTime,
        },
      }
      if (isStore.getters.getShoutoutPlanTime) {
        request.travelTime = {
          when: isStore.getters.getShoutoutPlanTime,
          arriving: false,
        }
      }
      isStore.actions.submitShoutOutPlanningsRequest(request)
    },
    onConfirmTravelOffer() {
      const { selectedCarId } = this.profile?.ridePlanOptions
      if (selectedCarId) {
        const travelOffer = {
          shoutoutPlanId: this.id,
          planRef: this.planResult.planRef,
          vehicleRef: `urn:nb:rs:car:${selectedCarId}`,
        }
        isStore.actions.storeTravelOffer(travelOffer)
        //TODO: Router to proper page after submitting a ride.
        // this.$router.go(-1)
      } else {
        //TODO: error handling.
        // eslint-disable-next-line
        console.log('No default car!')
        uiStore.actions.queueErrorNotification(
          'Voer eerste een auto in voordat je een rit gaat aanbieden.'
        )
      }
    },
    onLocationReset() {
      this.onProposeTravelOffer()
    },
    onLocationUpdate() {
      this.editDepart = true
      let params = { field: 'ridefrom', editSearchCriteria: false.toString() }
      this.$router.push({ name: 'searchLocation', params })
    },
    onProposalUpdate(request) {
      // Request consists of a time (moment) and location.
      const timestamp = moment(request.time)
      isStore.mutations.setShoutoutPlanTime(timestamp)
      this.fetchShoutOutPlan(timestamp, request.location)
    },
    onProposalCancel() {
      isStore.mutations.clearPlanningResults()
    },
    //TODO: Check if this mehod is needed.
    onTripCancelled() {
      isStore.actions.deleteShoutOut({ shoutoutPlanId: this.id })
    },
  },
}
</script>
