<template>
  <content-pane :clearpadding="true">
    <v-row>
      <v-col>
        <community-button
          class="mx-auto"
          forward="inbox"
          icon="fa-comments"
          naam="Berichten"
        ></community-button>
      </v-col>
      <v-col>
        <community-button
          class="mx-auto"
          icon="fa-map"
          forward="shoutOuts"
          naam="Oproepen"
          :aantal-berichten="shoutOutCount"
        ></community-button>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <community-button
          class="mx-auto"
          icon="fa-gift"
          naam="Beloningen"
          :disabled="true"
        ></community-button>
      </v-col>
      <v-col>
        <community-button
          class="mx-auto"
          icon="fa-bullseye"
          naam="Doelen"
          :disabled="!creditsEnabled"
          forward="charityOverviewPage"
        ></community-button>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import CommunityButton from '@/components/community/CommunityButton.vue'
import constants from '@/constants/constants'
import config from '@/config/config'
import * as psStore from '@/store/profile-service'
import * as isStore from '@/store/itinerary-service'

const CREDITS_ENABLED = config.CREDITS_ENABLED

/**
 * The community overview page shows the community activities: Messages about trips, shout-outs, goals to donate to and
 * an overview of rewards received.
 */
export default {
  components: {
    CommunityButton: CommunityButton,
    ContentPane,
  },
  data() {
    return {
      creditsEnabled: CREDITS_ENABLED || false,
    }
  },
  computed: {
    isPassenger() {
      const userRole = psStore.getters.getProfile.userRole
      return (
        userRole === constants.PROFILE_ROLE_PASSENGER ||
        userRole === constants.PROFILE_ROLE_BOTH
      )
    },
    isDriver() {
      const userRole = psStore.getters.getProfile.userRole
      return (
        userRole === constants.PROFILE_ROLE_DRIVER ||
        userRole === constants.PROFILE_ROLE_BOTH
      )
    },
    shoutOutCount() {
      let count = 0
      if (this.isPassenger) {
        count += isStore.getters.getMyShoutOutsCount
      }
      if (this.isDriver) {
        count += isStore.getters.getShoutOutsTotalCount
      }
      return count
    },
  },
  mounted() {
    const { address, userRole } = psStore.getters.getProfile
    if (this.isPassenger) {
      // Display the count of the user's own shout-outs.
      isStore.actions.fetchMyShoutOutTripPlans({ offset: 0, maxResults: 0 })
    }
    if (this.isDriver && address?.location) {
      // Display the community shout-out count, but only if my address is known
      isStore.actions.fetchShoutOuts({
        latitude: address.location.coordinates[1],
        longitude: address.location.coordinates[0],
        maxResults: 0,
      })
    }
  },
}
</script>
<style scoped></style>
