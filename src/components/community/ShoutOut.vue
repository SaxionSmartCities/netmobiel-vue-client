<template>
  <v-card
    outlined
    class="shout-out-container"
    :class="{ 'travel-offer': hasOffer }"
    @click="onShoutOutSelected"
  >
    <v-row v-if="!isUserTraveller" class="mb-2">
      <v-col class="shrink">
        <external-user-image :managed-identity="travellerIdentity" />
      </v-col>
      <v-col>
        <p class="font-weight-regular header mb-0">Passagier</p>
        <p class="font-weight-light subtitle-1 mb-0">
          {{ travellerName }}
        </p>
      </v-col>
      <v-col class="shrink align-center">
        <v-icon>chevron_right</v-icon>
      </v-col>
    </v-row>
    <v-row v-if="proposedRide">
      <v-col class="pt-0 pb-4">
        <h4>Jouw aanboden rit:</h4>
      </v-col>
    </v-row>
    <v-row
      v-for="(leg, index) in generateSteps()"
      :key="index"
      class="mx-1 py-0"
    >
      <itinerary-leg
        :leg="leg"
        :showicon="!!proposedRide"
        :showdottedline="!proposedRide"
        :step="index"
      />
    </v-row>
    <v-row v-if="hasOffer && isUserTraveller">
      <v-col class="">
        <h5 v-if="offeredItineraries.length === 1">Er is 1 rit aangeboden.</h5>
        <h5 v-else>
          Er zijn {{ offeredItineraries.length }} ritten aangeboden.
        </h5>
      </v-col>
    </v-row>
    <v-row justify="center" no-gutters>
      <v-col class="header ma text-left">
        <v-row v-if="duration" no-gutters>
          <v-col>
            <span>Reisduur </span>
          </v-col>
          <v-col>
            <span>{{ duration }} minuten</span>
          </v-col>
        </v-row>
        <v-row v-if="distance" no-gutters>
          <v-col>
            <span>Afstand </span>
          </v-col>
          <v-col>
            <span>{{ distance }} km</span>
          </v-col>
        </v-row>
        <v-row v-if="cost" no-gutters>
          <v-col>
            <span>Vergoeding </span>
          </v-col>
          <v-col>
            <span>{{ cost }} credits</span>
          </v-col>
        </v-row>
      </v-col>
      <v-col d-flex class="text-right" align-self="center">
        <v-btn small rounded depressed color="button">
          {{ nextAction }}
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import ExternalUserImage from '@/components/profile/ExternalUserImage.vue'
import { generateShoutOutDetailSteps } from '@/utils/itinerary_steps.js'
import * as psStore from '@/store/profile-service'
import * as csStore from '@/store/carpool-service'

export default {
  name: 'ShoutOut',
  components: { ItineraryLeg, ExternalUserImage },
  props: {
    shoutOut: { type: Object, required: false, default: () => null },
  },
  computed: {
    profile() {
      return psStore.getters.getProfile
    },
    myProfileImage() {
      return this.profile.image
    },
    traveller() {
      return this.shoutOut?.traveller
    },
    travellerIdentity() {
      return this.traveller ? this.traveller.managedIdentity : ''
    },
    isUserTraveller() {
      return this.profile.id === this.travellerIdentity
    },
    travellerName() {
      return this.traveller
        ? `${this.traveller.givenName} ${this.traveller.familyName}`
        : ''
    },
    cost() {
      let fare
      if (this.proposedRide?.distance) {
        // FIXME A proposed ride should have a fare!
        fare = 0
      } else if (this.shoutOut?.referenceItinerary) {
        // Assumption: Always a car/rideshare leg
        fare = this.shoutOut.referenceItinerary.legs
          .map(leg => leg.fareInCredits)
          .reduce((sum, f) => sum + f)
      }
      // Return cost in credits
      return fare
    },
    distance() {
      let distanceMeters
      // if (this.proposedRide?.distance) {
      //   distanceMeters = this.proposedRide.distance
      // } else if (this.shoutOut.referenceItinerary) {
      //   // Assumption: Always a car/rideshare leg
      //   distanceMeters = this.shoutOut.referenceItinerary.legs
      //     .map(leg => leg.distance)
      //     .reduce((sum, d) => sum + d)
      // }
      if (!this.proposedRide?.distance && this.shoutOut?.referenceItinerary) {
        // Assumption: Always a car/rideshare leg
        distanceMeters = this.shoutOut.referenceItinerary.legs
          .map(leg => leg.distance)
          .reduce((sum, d) => sum + d)
      }
      // Return distance in kilometers
      return distanceMeters ? Math.round(distanceMeters / 1000) : distanceMeters
    },
    duration() {
      let durationSecs
      // if (this.proposedRide?.duration) {
      //   durationSecs = this.proposedRide.duration
      // } else if (this.shoutOut.referenceItinerary) {
      //   durationSecs = this.shoutOut.referenceItinerary.duration
      // }
      if (!this.proposedRide?.duration && this.shoutOut?.referenceItinerary) {
        durationSecs = this.shoutOut.referenceItinerary.duration
      }
      // Return duration in minutes
      return durationSecs ? Math.round(durationSecs / 60) : durationSecs
    },
    nextAction() {
      return this.isUserTraveller
        ? 'Bekijk Oproep'
        : this.hasOffer
        ? 'Aanbod bekijken'
        : 'Rit aanbieden'
    },
    offeredItineraries() {
      return this.shoutOut?.itineraries?.filter(it => {
        return !it.legs.find(leg => leg.state === 'CANCELLED')
      })
    },
    hasOffer() {
      return !!this.proposedRide?.rideRef || this.offeredItineraries?.length > 0
    },
    proposedRides() {
      return csStore.getters.getProposedRides
    },
    /**
     * Loop through my rides and try to combine the shout-outs with the rides to find the shout-outs with
     * an offer from me. If so then attach the ride to the shout-out. Not so clean, but will do.
     */
    proposedRide() {
      return this.proposedRides.find(ride => {
        return !!ride.bookings.find(
          b => b.passengerTripPlanRef === this.shoutOut?.planRef
        )
      })
    },
  },
  methods: {
    generateSteps() {
      return generateShoutOutDetailSteps(this.shoutOut, this.proposedRide)
    },
    onShoutOutSelected() {
      this.$emit('shoutOutSelected', {
        shoutOut: this.shoutOut,
        proposedRide: this.proposedRide,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.ma {
  margin: auto;
}
.travel-offer {
  border: 1px solid $color-primary;
}

.shout-out-container {
  padding: 5px 15px;

  .shout-out-image {
    padding-right: 0;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 0 0 1px $color-light-grey;
  }
}
</style>
