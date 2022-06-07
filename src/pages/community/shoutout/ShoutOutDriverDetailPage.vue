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
        <h1>Oproep invulling</h1>
      </v-col>
      <v-col>
        <itinerary-summary-list :items="itinerarySummaryItems" />
      </v-col>
      <v-col><v-divider /></v-col>
    </v-row>
    <shout-out-passenger-profile v-if="shoutOut" :user="shoutOut.traveller" />
    <v-row dense>
      <v-col>
        <h4 v-if="itineraries.length > 0">
          <span v-if="isProposalCancelled">Jouw (geannuleerde) aanbod:</span>
          <span v-else>Jouw aanbod:</span>
        </h4>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <itinerary-leg
          v-for="(leg, index) in generateSteps"
          :key="index"
          :leg="leg"
          :showicon="itineraries.length > 0"
          :showdottedline="itineraries.length === 0"
          :part-of-passengers-itinerary="true"
        />
      </v-col>
    </v-row>
    <v-row dense>
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
          outlined
          color="primary"
          @click="contactPassenger"
        >
          Bericht passagier
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="proposedItinerary" dense>
      <v-col>
        <v-btn
          large
          rounded
          block
          outlined
          color="primary"
          @click="onShowProposedRide"
        >
          Bekijk mijn rit
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="allProposalsCancelled" dense>
      <v-col>
        <v-btn
          large
          rounded
          block
          depressed
          color="button"
          @click="onMakeOffer"
        >
          Rit aanbieden
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense class="d-flex flex-column">
      <v-col><v-divider /></v-col>
      <v-col class="mt-2">
        <h3>Jouw aanbod</h3>
      </v-col>
      <v-col v-if="itineraries.length === 0">
        <em>Er is nog geen rit aangeboden.</em>
      </v-col>
      <v-col v-else>
        <travel-proposal-summary
          v-for="(offer, index) in itineraries"
          :key="index"
          :index="index"
          :itinerary="offer"
          :selected="index === proposalIndex"
          class="my-2"
          @travel-proposal-selected="proposalIndex = index"
        />
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import ItinerarySummaryList from '@/components/itinerary-details/ItinerarySummaryList.vue'
import * as uiStore from '@/store/ui'
import * as isStore from '@/store/itinerary-service'
import RouteMap from '@/components/itinerary-details/RouteMap'
import { formatDateTimeLongYear } from '@/utils/datetime'
import ShoutOutBanner from '@/components/community/ShoutOutBanner'
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import { generateShoutOutItineraryDetailSteps } from '@/utils/itinerary_steps.js'
import TravelProposalSummary from '@/components/community/TravelProposalSummary.vue'
import ShoutOutPassengerProfile from '@/components/community/ShoutOutPassengerProfile'
import {
  restoreDataBeforeRouteEnter,
  saveDataBeforeRouteLeave,
} from '@/utils/navigation'

/**
 * This Page is used to show the driver view of details of an existing shout-out optionally with a proposal.
 */
export default {
  name: 'ShoutOutDriverDetailPage',
  components: {
    ShoutOutPassengerProfile,
    ShoutOutBanner,
    ContentPane,
    ItinerarySummaryList,
    ItineraryLeg,
    TravelProposalSummary,
    RouteMap,
  },
  beforeRouteEnter(to, from, next) {
    // The restore is called after the mount!
    // console.log(`beforeRouteEnter: ${from.name} --> ${to.name}`)
    next((vm) =>
      restoreDataBeforeRouteEnter(vm, {
        proposalIndex: (value) => value,
      })
    )
  },
  beforeRouteLeave(to, from, next) {
    // console.log(`beforeRouteLeave: ${from.name} --> ${to.name}`)
    saveDataBeforeRouteLeave(this, {
      proposalIndex: (value) => value,
    })
    next()
  },
  props: {
    // The urn of the shout-out
    shoutOutId: { type: String, required: true },
  },
  data() {
    return {
      showMap: false,
      mapSize: 'small',
      proposalIndex: -1,
    }
  },
  computed: {
    shoutOut() {
      return isStore.getters.getSelectedShoutOut
    },
    itineraries() {
      // List all (my) itineraries, including the cancelled ones.
      return this.shoutOut?.itineraries || []
    },
    proposedItinerary() {
      if (
        this.proposalIndex >= 0 &&
        this.proposalIndex < this.itineraries.length
      ) {
        return this.itineraries[this.proposalIndex]
      }
      return null
    },
    generateSteps() {
      if (this.shoutOut) {
        return generateShoutOutItineraryDetailSteps(
          this.shoutOut,
          this.proposedItinerary,
          true
        )
      }
      return []
    },
    isProposalCancelled() {
      return (
        this.proposedItinerary?.legs.find((leg) => leg.state !== 'CANCELLED') ==
        null
      )
    },
    // Select the first booking that is not cancelled
    firstValidProposalIndex() {
      return this.itineraries.findIndex(
        (it) => it.legs.find((leg) => leg.state !== 'CANCELLED') != null
      )
    },
    allProposalsCancelled() {
      return this.firstValidProposalIndex === -1
    },
    shouldShowMap() {
      return this.showMap
    },
    routeMapLegs() {
      let legs = null
      if (this.showMap) {
        legs = this.itinerary?.legs
      }
      return legs
    },
    itinerary() {
      return this.proposedItinerary ?? this.shoutOut?.referenceItinerary
    },
    itinerarySummaryItems() {
      let result = []
      const travelTime =
        this.itinerary?.departureTime ?? this.shoutOut?.travelTime
      if (travelTime) {
        result.push({
          label: 'Datum',
          value: formatDateTimeLongYear(travelTime),
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
      if (this.cost) {
        result.push({
          label: 'Vergoeding',
          value: `${this.cost} credits`,
        })
      }
      return result
    },
    cost() {
      return this.itinerary?.legs
        .filter((leg) => leg.fareInCredits != null)
        .map((leg) => leg.fareInCredits)
        .reduce((sum, f) => sum + f)
    },
    rideDuration() {
      const duration = this.itinerary?.duration
      return duration ? Math.round(duration / 60) : duration
    },
    // Get the distance the driver has to ride in total
    rideDistance() {
      const distance = this.itinerary?.legs
        .filter((leg) => leg.distance != null)
        .map((leg) => leg.distance)
        .reduce((sum, d) => sum + d)
      return distance ? Math.round(distance / 1000) : distance
    },
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    shoutOut(newValue, oldValue) {
      if (this.itineraries?.length > 0) {
        if (this.proposalIndex < 0) {
          this.proposalIndex = this.firstValidProposalIndex
          if (this.proposalIndex < 0) {
            this.proposalIndex = 0
          }
        }
      } else {
        this.proposalIndex = -1
      }
    },
  },
  mounted() {
    isStore.mutations.setSelectedShoutOut(null)
    isStore.actions.fetchShoutOut({ id: this.shoutOutId })
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  methods: {
    onMapSizeChanged({ size }) {
      this.mapSize = size
    },
    onMapClose() {
      this.showMap = false
      this.mapSize = 'small'
    },
    onShowProposedRide() {
      // The reference of the ride is in the rideshare leg under 'tripId', a bit confusing
      const rideshareLeg = this.proposedItinerary?.legs.find(
        (lg) => lg.tripId != null
      )
      if (rideshareLeg) {
        this.$router.push({
          name: 'rideDetailPage',
          params: { rideId: rideshareLeg.tripId },
        })
      }
    },
    onMakeOffer() {
      this.$router.push({
        name: 'shoutOutDriverPropose',
        params: { shoutOutId: this.shoutOutId },
      })
    },
    contactPassenger() {
      this.$router.push({
        name: `conversation`,
        params: {
          chatMeta: {
            // The message is about the shout-out
            context: this.shoutOut.planRef,
            // Context of driver is also this shout-out
            senderContext: this.shoutOut.planRef,
            // Context of the passenger is also the shout-out
            recipientContext: this.shoutOut.planRef,
            recipientManagedIdentity: this.shoutOut.traveller.managedIdentity,
          },
        },
      })
    },
  },
}
</script>
