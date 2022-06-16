<template>
  <content-pane>
    <v-row>
      <v-col>
        <community-button
          class="mx-auto"
          forward="inbox"
          icon="fa-comments"
          name="Berichten"
          :counter="unreadMessageCount"
        />
      </v-col>
      <v-col>
        <community-button
          class="mx-auto"
          icon="fa-map"
          forward="shoutOuts"
          name="Oproepen"
          :counter="shoutOutCount"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <community-button
          class="mx-auto"
          icon="fa-gift"
          name="Beloningen"
          forward="rewardOverviewPage"
        />
      </v-col>
      <v-col>
        <community-button
          class="mx-auto"
          icon="fa-bullseye"
          name="Goede Doelen"
          :disabled="!creditsEnabled"
          forward="charityOverviewPage"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <community-button
          class="mx-auto"
          icon="fa-user-tie"
          name="Gemachtigden"
          forward="delegateOverview"
        />
      </v-col>
      <v-col>
        <community-button
          v-if="canActAsDelegate"
          class="mx-auto"
          icon="fa-user-friends"
          name="Machtigingen"
          forward="delegatorOverview"
        />
      </v-col>
    </v-row>
    <v-row v-if="canActAsTreasurer">
      <v-col>
        <community-button
          class="mx-auto"
          icon="fa-user-tie"
          name="Financiën"
          forward="systemCreditsPage"
        />
      </v-col>
      <v-col>
        <community-button
          class="mx-auto"
          icon="fa-euro-sign"
          name="Uitbetalingen"
          forward="paymentBatchOverviewPage"
          :counter="withdrawalsRequestedCount"
        />
      </v-col>
    </v-row>
    <v-row v-if="canActAsTreasurer">
      <v-col>
        <community-button
          class="mx-auto"
          icon="fa-cog"
          name="Systeeminstellingen"
          forward="systemSettingsPage"
        />
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
import * as bsStore from '@/store/banker-service'
import * as msStore from '@/store/message-service'
import { coordinatesToGeoLocation } from '@/utils/Utils'
import moment from 'moment'

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
      withdrawalsRequestedCount: 0,
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
        count += isStore.getters.getMyShoutOuts.totalCount
      }
      if (this.isDriver) {
        count += isStore.getters.getShoutOuts.totalCount
      }
      return count
    },
    unreadMessageCount() {
      return msStore.getters.getUser?.unreadMessageCount
    },
    canActAsTreasurer() {
      return psStore.getters.canActAsTreasurer
    },
    canActAsDelegate() {
      return psStore.getters.canActAsDelegate
    },
  },
  watch: {
    canActAsTreasurer() {
      this.refreshWithdrawalCount()
    },
  },
  mounted() {
    const requestTime = moment().format()
    if (this.isPassenger) {
      // Display the count of the user's own shout-outs.
      isStore.actions.fetchMyShoutOutTripPlans({
        since: requestTime,
        inProgress: true, // Not the ones that are already fulfilled
        maxResults: 0,
      })
    }
    if (this.isDriver) {
      // Display the community shout-out count, but only if my address is known
      const { address } = this.profile
      const location = address?.location
        ? coordinatesToGeoLocation(address.location)
        : undefined
      isStore.actions.fetchShoutOuts({
        location,
        since: requestTime, // Only the ones that are still needed
        inProgress: true, // Not the ones that are already fulfilled
        maxResults: 0,
      })
    }
    msStore.actions.fetchMyStatus()
    this.refreshWithdrawalCount()
  },
  methods: {
    refreshWithdrawalCount() {
      if (this.canActAsTreasurer) {
        // Get the count of pending withdrawal requests
        bsStore.actions.fetchWithdrawalsRequestedCount().then((count) => {
          this.withdrawalsRequestedCount = count
        })
      }
    },
  },
}
</script>
<style scoped></style>
