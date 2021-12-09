<template>
  <content-pane>
    <template #header>
      <v-row
        v-if="shoutOutIsClosed"
        class="cancelled-banner text-center py-1"
        dense
        no-gutters
      >
        <v-col> Deze oproep is gesloten </v-col>
      </v-row>
      <v-row
        v-else-if="isShoutOutInThePast"
        class="cancelled-banner text-center py-1"
        dense
        no-gutters
      >
        <v-col> Deze oproep is vervallen </v-col>
      </v-row>
    </template>
    <v-row>
      <v-col class="py-0">
        <v-row v-if="selectedLegs && shouldShowMap" class="pa-0">
          <v-col class="pa-0">
            <route-map
              ref="mapComp"
              :legs="selectedLegs"
              :map-size-prop="mapSize"
              :single-leg-dashed="false"
              @sizeChanged="onMapSizeChanged"
              @closeMap="onMapClose"
            >
            </route-map>
          </v-col>
        </v-row>
        <v-row dense class="d-flex flex-column">
          <v-col>
            <h1 v-if="isProposedRideView">Oproep voorstel</h1>
            <h1 v-else>Oproep invulling</h1>
          </v-col>
          <v-col><v-divider /></v-col>
          <v-col class="py-0">
            <itinerary-summary-list :items="itinerarySummaryItems" />
          </v-col>
          <v-col><v-divider /></v-col>
          <v-col>
            <v-row dense class="d-flex flex-column">
              <v-col v-if="isProposedRideView">
                <shout-out-detail-driver
                  :ride="proposedRide"
                  @show-map-proposal="onMapShow"
                />
              </v-col>
              <v-col v-else>
                <shout-out-travel-proposal
                  v-if="shoutOut"
                  :shout-out="shoutOut"
                  :offer="travelOffer"
                  :search-criteria="searchCriteria"
                  :can-offer="canOffer"
                  @show-map-proposal="onMapShow"
                  @confirmTravelOffer="onConfirmTravelOffer"
                  @proposalCancel="onProposalCancel"
                  @updateTravelTime="onUpdateTravelTime"
                  @departureLocationUpdate="onDepartureLocationUpdate"
                  @departureLocationReset="onDepartureLocationReset"
                  @arrivalLocationUpdate="onArrivalLocationUpdate"
                  @arrivalLocationReset="onArrivalLocationReset"
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
import ContentPane from '@/components/common/ContentPane.vue'
import ItinerarySummaryList from '@/components/itinerary-details/ItinerarySummaryList.vue'
import ShoutOutDetailDriver from '@/components/community/ShoutOutDetailDriver.vue'
import ShoutOutTravelProposal from '@/components/community/ShoutOutTravelProposal.vue'
import { formatDateTimeLongNoYear } from '@/utils/datetime.js'
import * as uiStore from '@/store/ui'
import * as csStore from '@/store/carpool-service'
import * as psStore from '@/store/profile-service'
import * as gsStore from '@/store/geocoder-service'
import * as isStore from '@/store/itinerary-service'
import { geoPlaceToCriteria } from '@/utils/Utils'
import RouteMap from '@/components/itinerary-details/RouteMap'
import moment from 'moment'

/**
 * This Page is used to show the driver view of details of an existing shout-out proposal (with a rideId) as well as an
 * proposal being edited (no rideId yet).
 */
export default {
  name: 'ShoutOutDriverDetailPage',
  components: {
    ContentPane,
    ItinerarySummaryList,
    ShoutOutDetailDriver,
    ShoutOutTravelProposal,
    RouteMap,
  },
  beforeRouteEnter(to, from, next) {
    // console.log(`beforeRouteEnter: ${from.name} --> ${to.name}`)
    // Clear the search location when navigating from a different page than the location lookup page
    if (from?.name !== 'searchLocation') {
      gsStore.mutations.clearAllGeoLocationPicked()
    }
    next()
  },
  props: {
    // The urn of the shout-out
    shoutOutId: { type: String, required: true },
    // The urn of the proposed ride, if any
    rideId: { type: String, required: false, default: '' },
  },
  data() {
    return {
      showMap: false,
      mapSize: 'small',
      editDepart: true,
      searchCriteria: {
        shoutOutId: this.shoutOutId,
        from: undefined,
        to: undefined,
        travelTime: undefined,
      },
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
      return isStore.getters.getSelectedShoutOut
    },
    // The ride, if any, offered to the traveller
    proposedRide() {
      return csStore.getters.getSelectedRide
    },
    isProposedRideView() {
      return this.rideId !== 'none'
    },
    itinerarySummaryItems() {
      let result = []
      let travelTime
      // Do NOT check an observed object for truthiness, there is always an observer property!
      if (this.proposedRide?.rideRef) {
        travelTime = this.proposedRide?.departureTime
      } else {
        travelTime = this.shoutOut?.travelTime
      }
      if (travelTime) {
        result.push({
          label: 'Datum',
          value: formatDateTimeLongNoYear(travelTime),
        })
      }
      if (this.rideDuration) {
        result.push({
          label: 'Reisduur',
          value: `${this.rideDuration} minuten`,
        })
      }
      if (this.rideDistance) {
        result.push({ label: 'Afstand', value: `${this.rideDistance} km` })
      }
      if (this.travellerName) {
        result.push({ label: 'Passagier', value: this.travellerName })
      }
      return result
    },
    rideDuration() {
      let duration
      if (this.proposedRide?.duration) {
        duration = this.proposedRide.duration
      } else if (this.itinerary?.duration) {
        duration = this.itinerary.duration
      }
      return duration ? Math.round(duration / 60) : duration
    },
    // Get the distance the driver has to ride in total
    rideDistance() {
      let distance
      if (this.proposedRide?.distance) {
        distance = this.proposedRide.distance
      } else if (this.itinerary) {
        distance = this.itinerary.legs
          .map((leg) => leg.distance)
          .reduce((sum, d) => sum + d)
      }
      return distance ? Math.round(distance / 1000) : distance
    },
    travellerName() {
      if (this.shoutOut?.traveller) {
        return `${this.shoutOut.traveller.givenName} ${this.shoutOut.traveller.familyName}`
      }
      return 'Onbekend'
    },
    suggestedItinerary() {
      return this.planResult?.itineraries && this.planResult?.itineraries[0]
    },
    travelOffer() {
      return isStore.getters.getPlanningRequest.tripPlan
    },
    selectedCar() {
      return csStore.getters.getSelectedCar
    },
    shouldShowMap() {
      return this.showMap
    },
    selectedLegs() {
      let legs = null
      if (this.showMap) {
        if (this.proposedRide?.legs) {
          legs = this.proposedRide.legs
        } else if (this.itinerary?.legs) {
          legs = this.itinerary.legs
        }
      }
      return legs
    },
    itinerary() {
      return this.suggestedItinerary?.itineraryRef
        ? this.suggestedItinerary
        : this.shoutOut?.referenceItinerary
    },
    shoutOutIsClosed() {
      // If requestDuration is set, then the shout-out has been closed.
      return !!this.shoutOut?.requestDuration
    },
    isShoutOutInThePast() {
      return (
        this.shoutOut?.latestArrivalTime &&
        moment(this.shoutOut?.latestArrivalTime).isBefore(moment())
      )
    },
    canOffer() {
      return !this.shoutOutIsClosed && !this.isShoutOutInThePast
    },
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    shoutOut(newValue, oldValue) {
      // console.log(
      //   `shoutOut: old = ${oldValue?.planRef}, new = ${newValue?.planRef}`
      // )
      // Do not just simply check the truthiness of the object (if (newValue) { ....}), that does not work with observed values.
      if (newValue?.planRef && !this.isProposedRideView && this.canOffer) {
        // Fetch the default plan: Driver and passenger same plan
        // But only when there is no rideId, because then we have already made a proposal.
        this.fetchShoutOutPlan()
      }
    },
  },
  // beforeRouteLeave(to, from, next) {
  //   // console.log(`beforeRouteLeave: ${from.name} --> ${to.name}`)
  //   next()
  // },
  mounted() {
    isStore.mutations.setSelectedShoutOut({})
    csStore.mutations.setSelectedRide({})
    isStore.mutations.clearPlanningResults()
    isStore.actions.fetchShoutOut({ id: this.shoutOutId })
    if (this.isProposedRideView) {
      csStore.actions.fetchRide({
        id: this.rideId,
      })
    } else {
      const { selectedCarRef } = this.profile?.ridePlanOptions
      if (selectedCarRef) {
        csStore.actions.fetchCar({ id: selectedCarRef })
      }
    }
    const fromPlace = gsStore.getters.getPickedLocations.get('from')?.place
    this.searchCriteria.from = geoPlaceToCriteria(fromPlace)
    const toPlace = gsStore.getters.getPickedLocations.get('to')?.place
    this.searchCriteria.to = geoPlaceToCriteria(toPlace)
    // console.log(
    //   `SearchCriteria: From: ${this.searchCriteria.from?.label} To: ${this.searchCriteria.to?.label} Travel time: ${this.searchCriteria.travelTime?.when} ${this.searchCriteria.travelTime?.arriving}`
    // )
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  methods: {
    fetchShoutOutPlan() {
      isStore.actions.planShoutOutSolution(this.searchCriteria)
    },
    onConfirmTravelOffer() {
      if (!this.selectedCar?.carRef) {
        uiStore.actions.queueErrorNotification(
          'Voer eerst een auto in voordat je een rit gaat aanbieden.'
        )
      } else {
        const travelOffer = {
          shoutOutPlanId: this.shoutOutId,
          planRef: this.planResult.planRef,
          vehicleRef: this.selectedCar.carRef,
        }
        isStore.actions.addShoutOutTravelOffer(travelOffer).then(() => {
          this.$router.push({ name: 'shoutOuts' })
        })
      }
    },
    onDepartureLocationReset() {
      this.searchCriteria = { ...this.searchCriteria, from: undefined }
      this.fetchShoutOutPlan()
    },
    onDepartureLocationUpdate() {
      let params = { field: 'from', editSearchCriteria: false.toString() }
      this.$router.push({ name: 'searchLocation', params })
    },
    onArrivalLocationReset() {
      this.searchCriteria = { ...this.searchCriteria, to: undefined }
      this.fetchShoutOutPlan()
    },
    onArrivalLocationUpdate() {
      let params = { field: 'to', editSearchCriteria: false.toString() }
      this.$router.push({ name: 'searchLocation', params })
    },
    onUpdateTravelTime(travelTime) {
      // TravelTime.when is moment. TravelTime.arriving flags which field.
      // Force vue to notify the change in input of the proposal component
      this.searchCriteria = {
        ...this.searchCriteria,
        travelTime: {
          when: travelTime.when,
          arriving: travelTime.arriving,
        },
      }
      this.fetchShoutOutPlan()
    },
    onProposalCancel() {
      isStore.mutations.clearPlanningResults()
      this.$router.push({ name: 'shoutOuts' })
    },
    onMapSizeChanged({ size }) {
      this.mapSize = size
    },
    onMapClose() {
      this.showMap = false
    },
    forceRerender() {
      // Remove my-component from the DOM
      this.showMap = false
      this.$nextTick(() => {
        // Add the component back in
        this.showMap = true
      })
    },
    onMapShow() {
      this.showMap = true
      this.mapSize = 'small'
      this.forceRerender()
    },
  },
}
</script>
