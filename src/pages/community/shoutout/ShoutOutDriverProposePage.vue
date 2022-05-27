<template>
  <content-pane>
    <template #header>
      <shout-out-banner v-if="shoutOut" :shout-out="shoutOut" />
    </template>
    <v-row v-if="routeMapLegs && routeMapLegs.length > 0 && shouldShowMap">
      <v-col>
        <route-map
          ref="mapComp"
          :legs="routeMapLegs"
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
        <h1>Oproep voorstel</h1>
      </v-col>
      <v-col>
        <itinerary-summary-list :items="itinerarySummaryItems" />
      </v-col>
      <v-col><v-divider /></v-col>
    </v-row>
    <!--    <v-row>-->
    <!--      <v-col>-->
    <!--        <shout-out-travel-proposal-->
    <!--          v-if="shoutOut"-->
    <!--          :shout-out="shoutOut"-->
    <!--          :offer="travelOffer"-->
    <!--          :search-criteria="searchCriteria"-->
    <!--          :can-offer="canOffer"-->
    <!--          @show-map-proposal="showMap = true"-->
    <!--          @confirmTravelOffer="onConfirmTravelOffer"-->
    <!--          @proposalCancel="onProposalCancel"-->
    <!--          @updateTravelTime="onUpdateTravelTime"-->
    <!--          @departureLocationUpdate="onDepartureLocationUpdate"-->
    <!--          @departureLocationReset="onDepartureLocationReset"-->
    <!--          @arrivalLocationUpdate="onArrivalLocationUpdate"-->
    <!--          @arrivalLocationReset="onArrivalLocationReset"-->
    <!--          @contact-passenger="onContactPassenger"-->
    <!--        />-->
    <!--      </v-col>-->
    <!--    </v-row>-->
    <v-row v-if="shoutOut && shoutOut.planRef">
      <v-col>
        <shout-out-travel-proposal-editor
          :time="departureTime"
          :location="departureLocation"
          :default-location="shoutOut.from"
          :is-arrival="false"
          :is-enabled="canPropose"
          @updateTravelTime="onUpdateTravelTime"
          @locationUpdate="onDepartureLocationUpdate"
          @locationReset="onDepartureLocationReset"
        />
      </v-col>
    </v-row>
    <v-row v-if="generateSteps.length === 0">
      <v-col>
        <em>Helaas, er is geen route gevonden!</em>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <itinerary-leg
          v-for="(leg, index) in generateSteps"
          :key="index"
          :leg="leg"
          :showicon="true"
          :showdottedline="true"
          :step="index"
          :part-of-passengers-itinerary="false"
          :can-view-profile="false"
        />
      </v-col>
    </v-row>
    <v-row v-if="shoutOut && shoutOut.planRef">
      <v-col>
        <shout-out-travel-proposal-editor
          :time="arrivalTime"
          :location="arrivalLocation"
          :default-location="shoutOut.to"
          :is-arrival="true"
          :is-enabled="canPropose"
          @updateTravelTime="onUpdateTravelTime"
          @locationUpdate="onArrivalLocationUpdate"
          @locationReset="onArrivalLocationReset"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          large
          rounded
          outlined
          block
          depressed
          color="primary"
          @click="showMap = true"
        >
          Bekijk op de kaart
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-btn
          large
          rounded
          block
          depressed
          color="button"
          :disabled="generateSteps.length === 0 || !planResult"
          @click="onConfirmTravelOffer"
        >
          Aanbod bevestigen
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          large
          rounded
          block
          depressed
          outlined
          color="primary"
          @click="onCancelProposal"
        >
          Annuleren
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import ItinerarySummaryList from '@/components/itinerary-details/ItinerarySummaryList.vue'
import * as uiStore from '@/store/ui'
import * as csStore from '@/store/carpool-service'
import * as psStore from '@/store/profile-service'
import * as gsStore from '@/store/geocoder-service'
import * as isStore from '@/store/itinerary-service'
import { geoPlaceToCriteria } from '@/utils/Utils'
import RouteMap from '@/components/itinerary-details/RouteMap'
import moment from 'moment'
import { formatDateTimeLongYear } from '@/utils/datetime'
import ShoutOutBanner from '@/components/community/ShoutOutBanner'
import ShoutOutTravelProposalEditor from '@/components/community/ShoutOutTravelProposalEditor'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg'
import { generateShoutOutItineraryDetailSteps } from '@/utils/itinerary_steps'

/**
 * Decision: Show in the header the characteristics of the proposal (as opposed to the reference itinerary)
 */
export default {
  name: 'ShoutOutDriverProposePage',
  components: {
    ContentPane,
    ItinerarySummaryList,
    ShoutOutTravelProposalEditor,
    RouteMap,
    ShoutOutBanner,
    ItineraryLeg,
  },
  beforeRouteEnter(to, from, next) {
    // console.log(`beforeRouteEnter: ${from.name} --> ${to.name}`)
    // Clear the search location when navigating from a different page except for some
    const keepWhenComingFrom = ['searchLocation', 'CarsPage']
    if (!keepWhenComingFrom.includes(from?.name)) {
      gsStore.mutations.clearAllGeoLocationPicked()
      isStore.mutations.setSearchCriteria({})
    }
    next()
  },
  // beforeRouteLeave(to, from, next) {
  //   // console.log(`beforeRouteLeave: ${from.name} --> ${to.name}`)
  //   next()
  // },
  props: {
    // The urn of the shout-out
    shoutOutId: { type: String, required: true },
  },
  data() {
    return {
      showMap: false,
      mapSize: 'small',
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
    searchCriteria() {
      return isStore.getters.getSearchCriteria
    },
    shoutOut() {
      return isStore.getters.getSelectedShoutOut
    },
    proposedItinerary() {
      return this.planResult?.itineraries[0]
    },
    itinerary() {
      return this.proposedItinerary?.itineraryRef
        ? this.proposedItinerary
        : this.shoutOut?.referenceItinerary
    },
    ridePlanOptions() {
      return psStore.getters.getProfile?.ridePlanOptions
    },
    selectedCar() {
      const selectedCarRef = this.ridePlanOptions?.selectedCarRef
      const cars = csStore.getters.getAvailableCars
      return cars.find((car) => car.carRef === selectedCarRef)
    },
    shouldShowMap() {
      return this.showMap
    },
    routeMapLegs() {
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
    shoutOutIsClosed() {
      // If requestDuration is set, then the shout-out has been closed or cancelled
      return this.shoutOut?.requestDuration != null
    },
    isShoutOutInThePast() {
      return (
        this.shoutOut?.latestArrivalTime &&
        moment(this.shoutOut?.latestArrivalTime).isBefore(moment())
      )
    },
    canPropose() {
      return (
        !this.shoutOutIsClosed &&
        !this.isShoutOutInThePast &&
        this.selectedCar != null
      )
    },
    itinerarySummaryItems() {
      let result = []
      if (this.itinerary?.departureTime) {
        result.push({
          label: 'Datum',
          value: formatDateTimeLongYear(this.itinerary?.departureTime),
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
      if (this.shoutOut?.traveller) {
        const traveller = this.shoutOut.traveller
        result.push({
          label: 'Passagier',
          value: `${traveller.givenName} ${traveller.familyName}`,
        })
      }
      result.push({
        label: 'Auto',
        value: this.selectedCar,
        renderingComponent: 'CarViewer',
      })
      if (this.ridePlanOptions.maxPassengers != null) {
        result.push({
          label: 'Stoelen over',
          value: this.ridePlanOptions.maxPassengers,
        })
      }
      const fare = this.itinerary?.legs
        .filter((leg) => leg.fareInCredits != null)
        .map((leg) => leg.fareInCredits)
        .reduce((sum, f) => sum + f)
      if (fare) {
        result.push({
          label: 'Vergoeding',
          value: `${fare} credits`,
        })
      }
      return result
    },
    // Get the duration of the driver in total
    rideDuration() {
      const duration = this.itinerary?.duration
      return duration ? Math.round(duration / 60) : undefined
    },

    // Get the distance the driver has to ride in total
    rideDistance() {
      const distance = this.itinerary?.legs
        .map((leg) => leg.distance)
        .reduce((sum, d) => sum + d)
      return distance ? Math.round(distance / 1000) : undefined
    },
    departureLocation() {
      return this.searchCriteria.from
        ? this.searchCriteria.from
        : this.shoutOut.from
    },
    departureTime() {
      let dtime
      if (
        this.searchCriteria.travelTime &&
        !this.searchCriteria.travelTime.arriving
      ) {
        dtime = this.searchCriteria.travelTime.when
      } else if (this.itinerary?.departureTime) {
        dtime = moment(this.itinerary.departureTime)
      }
      return dtime
    },
    arrivalLocation() {
      return this.searchCriteria.to ? this.searchCriteria.to : this.shoutOut.to
    },
    arrivalTime() {
      let atime
      if (
        this.searchCriteria.travelTime &&
        this.searchCriteria.travelTime.arriving
      ) {
        atime = this.searchCriteria.travelTime.when
      } else if (this.itinerary?.arrivalTime) {
        atime = moment(this.itinerary?.arrivalTime)
      }
      return atime
    },
    generateSteps() {
      return this.shoutOut
        ? generateShoutOutItineraryDetailSteps(
            this.shoutOut,
            this.proposedItinerary,
            true
          )
        : []
    },
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    shoutOut(newValue, oldValue) {
      const fromPlace = gsStore.getters.getPickedLocations.get('from')?.place
      const toPlace = gsStore.getters.getPickedLocations.get('to')?.place
      let newCriteria = {
        ...this.searchCriteria,
        from: geoPlaceToCriteria(fromPlace),
        to: geoPlaceToCriteria(toPlace),
      }
      if (!this.searchCriteria.travelTime) {
        newCriteria.travelTime = {
          when: moment(newValue.travelTime),
          arriving: newValue.useAsArrivalTime,
        }
      }
      isStore.mutations.setSearchCriteria(newCriteria)
      // const sc = this.searchCriteria
      // console.log(
      //   `Watch SC: From: ${sc.from?.label} To: ${sc.to?.label} Travel time: ${sc.travelTime?.when} ${sc.travelTime?.arriving}`
      // )
      // Do not just simply check the truthiness of the object (if (newValue) { ....}), that does not work with observed values.
      if (newValue?.planRef && this.canPropose) {
        // Fetch the default plan: Driver and passenger same plan
        this.planShoutOutSolution()
      }
    },
  },
  mounted() {
    isStore.mutations.clearPlanningResults()
    isStore.actions.fetchShoutOut({ id: this.shoutOutId })
    csStore.actions.fetchCars()
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  methods: {
    planShoutOutSolution() {
      isStore.actions.planShoutOutSolution({
        ...this.searchCriteria,
        shoutOutId: this.shoutOutId,
      })
    },
    onConfirmTravelOffer() {
      if (!this.selectedCar) {
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
          // Update the shout-out object
          isStore.actions.fetchShoutOut({ id: this.shoutOutId })
        })
      }
    },
    onDepartureLocationReset() {
      isStore.mutations.setSearchCriteria({
        ...this.searchCriteria,
        from: undefined,
      })
      this.planShoutOutSolution()
    },
    onDepartureLocationUpdate() {
      let params = { field: 'from', editSearchCriteria: false.toString() }
      this.$router.push({ name: 'searchLocation', params })
    },
    onArrivalLocationReset() {
      isStore.mutations.setSearchCriteria({
        ...this.searchCriteria,
        to: undefined,
      })
      this.planShoutOutSolution()
    },
    onArrivalLocationUpdate() {
      let params = { field: 'to', editSearchCriteria: false.toString() }
      this.$router.push({ name: 'searchLocation', params })
    },
    onUpdateTravelTime(travelTime) {
      // TravelTime.when is moment. TravelTime.arriving flags which field.
      isStore.mutations.setSearchCriteria({
        ...this.searchCriteria,
        travelTime: {
          when: travelTime.when,
          arriving: travelTime.arriving,
        },
      })
      this.planShoutOutSolution()
    },
    onMapSizeChanged({ size }) {
      this.mapSize = size
    },
    onMapClose() {
      this.showMap = false
      this.mapSize = 'small'
    },
    onCancelProposal() {
      this.$router.go(-1)
    },
  },
}
</script>
