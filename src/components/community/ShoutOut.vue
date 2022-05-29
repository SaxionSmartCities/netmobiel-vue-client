<template>
  <v-card outlined class="pa-2" :class="getCssStatusClass">
    <v-overlay
      :color="overlayColor"
      :value="displayOverlay"
      :absolute="true"
      opacity="0.08"
    />
    <shout-out-passenger-profile
      v-if="!isUserTraveller && traveller"
      :user="traveller"
      :can-view-profile="false"
    />
    <v-row v-if="firstValidItinerary">
      <v-col class="pt-0 pb-4">
        <h4>
          <span v-if="!isUserTraveller">Jouw aanboden rit:</span>
          <span v-else-if="isFinal">Je geaccepteerde aanbieding:</span>
        </h4>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <itinerary-leg
          v-for="(leg, index) in generateSteps"
          :key="index"
          :leg="leg"
          :showicon="firstValidItinerary != null"
          :showdottedline="firstValidItinerary == null"
          :step="index"
          :part-of-passengers-itinerary="true"
          :show-profile="false"
        />
      </v-col>
    </v-row>
    <v-row v-if="hasOffer && isUserTraveller && !isFinal">
      <v-col class="">
        <h5>
          <span v-if="offeredItineraries.length === 1"
            >Er is 1 rit aangeboden.</span
          >
          <span v-else
            >Er zijn {{ offeredItineraries.length }} ritten aangeboden.</span
          >
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
        <v-btn
          small
          rounded
          depressed
          color="button"
          @click="onShoutOutSelected"
        >
          {{ nextAction }}
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import ItineraryLeg from '@/components/itinerary-details/ItineraryLeg.vue'
import { generateShoutOutItineraryDetailSteps } from '@/utils/itinerary_steps.js'
import * as psStore from '@/store/profile-service'
import ShoutOutPassengerProfile from '@/components/community/ShoutOutPassengerProfile'

export default {
  name: 'ShoutOut',
  components: { ItineraryLeg, ShoutOutPassengerProfile },
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
    isUserTraveller() {
      return this.profile.id === this.traveller?.managedIdentity
    },
    isCancelled() {
      return (
        this.shoutOut?.planState === 'CANCELLED' ||
        (this.shoutOut?.planState === 'FINAL' &&
          this.firstValidItinerary == null)
      )
    },
    isFinal() {
      return (
        this.shoutOut?.planState === 'FINAL' && this.firstValidItinerary != null
      )
    },
    getCssStatusClass() {
      let css
      if (this.isFinal) {
        css = 'is-final'
        if (this.hasOffer) {
          css += ' travel-offer'
        }
      } else if (this.isCancelled) {
        css = 'is-cancelled'
      } else if (this.hasOffer) {
        css = 'travel-offer'
      } else {
        css = ''
      }
      return css
    },
    displayOverlay() {
      return this.completed || this.cancelled
    },
    // HACK: Should be done using CSS.
    overlayColor() {
      if (this.isCancelled) {
        return '#d0021b'
      } else if (this.isFinal) {
        return '#2e8997'
      }
      return ''
    },
    itinerary() {
      return this.firstValidItinerary ?? this.shoutOut?.referenceItinerary
    },
    cost() {
      // Return cost in credits
      return this.itinerary?.legs
        .filter((leg) => leg.fareInCredits != null)
        .map((leg) => leg.fareInCredits)
        .reduce((sum, f) => sum + f)
    },
    // Distance in km
    distance() {
      const distance = this.itinerary?.legs
        .filter((leg) => leg.distance != null)
        .map((leg) => leg.distance)
        .reduce((sum, d) => sum + d)
      return distance ? Math.round(distance / 1000) : distance
    },
    duration() {
      const duration = this.itinerary?.duration
      return duration ? Math.round(duration / 60) : duration
    },
    nextAction() {
      if (this.isUserTraveller) {
        return 'Bekijk Oproep'
      } else if (this.hasOffer) {
        return 'Aanbod bekijken'
      } else {
        return 'Bekijk Oproep'
      }
    },
    offeredItineraries() {
      return this.shoutOut?.itineraries?.filter((it) => {
        return !it.legs.find((leg) => leg.state === 'CANCELLED')
      })
    },
    hasOffer() {
      return this.offeredItineraries?.length > 0
    },
    firstValidItinerary() {
      // if (this.isUserTraveller) {
      //   return undefined
      // }
      return this.shoutOut?.itineraries.find((it) => {
        return it.legs.findIndex((lg) => lg.state !== 'CANCELLED') >= 0
      })
    },
    generateSteps() {
      if (this.shoutOut) {
        return generateShoutOutItineraryDetailSteps(
          this.shoutOut,
          this.firstValidItinerary
        )
      }
      return []
    },
  },
  methods: {
    onShoutOutSelected() {
      this.$emit('shoutOutSelected', {
        shoutOut: this.shoutOut,
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
.is-cancelled {
  border-color: $color-alertRed !important;
}
.is-completed {
  border-color: $color-primary !important;
}
// Make the overlay transparent for pointer events
.v-card > .v-overlay {
  pointer-events: none;
}
</style>
