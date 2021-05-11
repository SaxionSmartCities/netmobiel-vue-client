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
          forward="shoutouts"
          naam="Oproepen"
          :aantal-berichten="shoutoutCount"
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
    shoutoutCount() {
      const userRole = psStore.getters.getProfile.userRole
      if (userRole == constants.PROFILE_ROLE_PASSENGER) {
        return isStore.getters.getMyShoutOutsCount
      } else {
        return isStore.getters.getShoutOutsTotalCount
      }
    },
  },
  mounted() {
    const { address, userRole } = psStore.getters.getProfile
    if (userRole === constants.PROFILE_ROLE_PASSENGER) {
      // Display the count of the users' own shoutouts.
      isStore.actions.fetchMyShoutOuts({ offset: 0 })
    } else if (address && address.location) {
      // Display the community shoutouts.
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
