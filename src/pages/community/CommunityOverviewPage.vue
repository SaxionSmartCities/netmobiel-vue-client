<template>
  <content-pane>
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
          naam="Goede Doelen"
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
import { coordinatesToGeoLocation } from '@/utils/Utils'

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
    profile() {
      return psStore.getters.getProfile
    },
    isPassenger() {
      const userRole = this.profile.userRole
      return (
        userRole === constants.PROFILE_ROLE_PASSENGER ||
        userRole === constants.PROFILE_ROLE_BOTH
      )
    },
    isDriver() {
      const userRole = this.profile.userRole
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
    if (this.isPassenger) {
      // Display the count of the user's own shout-outs.
      isStore.actions.fetchMyShoutOutTripPlans({ offset: 0, maxResults: 0 })
    }
    if (this.isDriver) {
      // Display the community shout-out count, but only if my address is known
      const { address } = this.profile
      const location = address?.location
        ? coordinatesToGeoLocation(address.location)
        : undefined
      isStore.actions.fetchShoutOuts({ location, maxResults: 0 })
    }
  },
}
</script>
<style scoped></style>
