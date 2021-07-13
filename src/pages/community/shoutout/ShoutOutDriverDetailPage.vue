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
              <v-col v-if="proposedRide && proposedRide.rideRef">
                <shout-out-detail-driver :ride="proposedRide" />
              </v-col>
              <v-col v-else>
                <shout-out-travel-proposal
                  :shout-out="shoutOut"
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
    // The urn of the shout-out
    shoutOutId: { type: String, required: true },
    // The urn of the proposed ride, if any
    rideId: { type: String, required: false, default: '' },
  },
  data() {
    return {
      editDepart: false,
    }
  },
  computed: {
    ...{
      profile: () => psStore.getters.getProfile,
      // The planning results to offer to the traveller
      planningRequest: () => isStore.getters.getPlanningRequest,
      planningStatus: () => isStore.getters.getPlanningStatus,
      planResult: () => isStore.getters.getPlanningResults,
    },
    // The shout-out of the traveller
    shoutOut() {
      // console.log(`has shoutOut: ${!!csStore.getters.getSelectedRide}`)
      return isStore.getters.getSelectedTrip
    },
    // The ride, if any, offered to the traveller
    proposedRide() {
      return csStore.getters.getSelectedRide
    },
    itinerarySummaryItems() {
      let result = []
      const travelTime =
        this.proposedRide?.departureTime || this.shoutOut?.travelTime
      if (travelTime) {
        result.push({ label: 'Datum', value: formatDateTimeLong(travelTime) })
      }
      result.push({ label: 'Reisduur', value: this.rideDuration })
      result.push({ label: 'Afstand', value: `${this.rideDistance} km` })
      result.push({ label: 'Reiziger', value: this.travellerName })
      return result
    },
    rideDuration() {
      let reisduur = 'Onbekend'
      if (this.proposedRide?.duration) {
        const duration = this.proposedRide?.duration
        reisduur = `${Math.round(duration / 60)} minuten`
      } else if (this.planResult?.itineraries?.length > 0) {
        reisduur = this.planResult?.itineraries[0].duration
      }
      return reisduur
    },
    rideDistance() {
      let distance = 'Onbekend'
      if (this.proposedRide?.distance) {
        distance = Math.round(this.proposedRide.distance / 1000)
      } else if (this.shoutOut?.from && this.shoutOut?.to) {
        distance =
          getDistance(this.shoutOut.from, this.shoutOut.to, 1000) / 1000
      }
      return distance
    },
    travellerName() {
      if (this.shoutOut?.traveller) {
        return `${this.shoutOut.traveller.givenName} ${this.shoutOut.traveller.familyName}`
      }
      return 'Onbekend'
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
    editDepart(newValue) {
      // Note: BeforeRouteEnter fires after mount so we will watch the editDepart value
      // here to get the updated value.
      const { ridefrom } = gsStore.getters.getPickedLocation
      if (newValue && ridefrom) {
        const time = isStore.getters.getShoutoutPlanTime
        const location = {
          label: ridefrom.title,
          latitude: ridefrom.location.coordinates[1],
          longitude: ridefrom.location.coordinates[0],
        }
        this.fetchShoutOutPlan(time, location)
        gsStore.mutations.setGeoLocationPicked({
          field: 'ridefrom',
          place: null,
        })
      }
    },
  },
  mounted() {
    isStore.mutations.setSelectedTrip({})
    csStore.mutations.setSelectedRide({})
    isStore.mutations.clearPlanningResults()
    isStore.actions.fetchShoutOut({ id: this.shoutOutId })
    if (this.rideId && this.rideId !== 'none') {
      csStore.actions.fetchRide({
        id: this.rideId,
      })
    }
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
        shoutOutId: this.shoutOutId,
        from: location,
        travelTime: { when: time, arriving: false },
      }
      isStore.actions.planShoutOutSolution(request)
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
        shoutOutId: this.shoutOutId,
        from: from,
        // When travelTime is omitted the backend will calculate to arrive in time at the pickup location
        // travelTime: {
        //   when: moment(this.shoutOut.travelTime),
        //   arriving: this.shoutOut.useAsArrivalTime,
        // },
      }
      // FIXME This is actually the time the driver starts riding. That can be read from the plan, no need for the store.
      if (isStore.getters.getShoutoutPlanTime) {
        request.travelTime = {
          when: isStore.getters.getShoutoutPlanTime,
          arriving: false,
        }
      }
      isStore.actions.planShoutOutSolution(request)
    },
    onConfirmTravelOffer() {
      const { selectedCarId } = this.profile?.ridePlanOptions
      if (selectedCarId) {
        const travelOffer = {
          shoutOutPlanId: this.shoutOutId,
          planRef: this.planResult.planRef,
          vehicleRef: `urn:nb:rs:car:${selectedCarId}`,
        }
        isStore.actions.addShoutOutTravelOffer(travelOffer)
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
  },
}
</script>
