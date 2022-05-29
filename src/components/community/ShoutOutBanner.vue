<template>
  <v-row
    class="text-center shrink"
    dense
    no-gutters
    :class="{
      'cancelled-banner': showAsCancelled,
      'information-banner': !showAsCancelled,
    }"
  >
    <v-col>
      <span v-if="isFinal"> Deze oproep is ingevuld</span>
      <span v-else-if="isCancelled"> Deze oproep is geannuleerd</span>
      <span v-else-if="isShoutOutInThePast"> Deze oproep is verstreken </span>
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'
import * as psStore from '@/store/profile-service'

export default {
  name: 'ShoutOutBanner',
  props: {
    shoutOut: { type: Object, required: true },
  },
  computed: {
    profile() {
      return psStore.getters.getProfile
    },
    traveller() {
      return this.shoutOut?.traveller
    },
    isUserTraveller() {
      return this.profile.id === this.traveller?.managedIdentity
    },
    itineraries() {
      // List all itineraries, including the cancelled ones.
      return this.shoutOut?.itineraries || []
    },
    isShoutOutClosed() {
      // If requestDuration is set, then the shout-out has been closed or cancelled
      return !!this.shoutOut?.requestDuration
    },
    isShoutOutInThePast() {
      return (
        this.shoutOut?.latestArrivalTime &&
        moment(this.shoutOut?.latestArrivalTime).isBefore(moment())
      )
    },
    firstValidProposalIndex() {
      return this.itineraries.findIndex(
        (it) => it.legs.find((leg) => leg.state !== 'CANCELLED') != null
      )
    },
    isFinal() {
      return (
        this.shoutOut?.planState === 'FINAL' &&
        this.firstValidProposalIndex >= 0
      )
    },
    isCancelled() {
      return (
        this.shoutOut?.planState === 'CANCELLED' ||
        (this.shoutOut?.planState === 'FINAL' &&
          this.firstValidProposalIndex === -1)
      )
    },
    showAsCancelled() {
      // console.log(`IsUser: ${this.isUserTraveller} isFinal ${this.isFinal} Past ${}`)
      if (this.isUserTraveller) {
        return (!this.isFinal && this.isShoutOutInThePast) || this.isCancelled
      } else {
        return this.isShoutOutInThePast || this.isShoutOutClosed
      }
    },
  },
}
</script>
