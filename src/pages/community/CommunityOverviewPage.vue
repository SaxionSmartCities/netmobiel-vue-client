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
          :aantal-berichten="shoutOutsTotalCount"
        ></community-button>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <community-button
          class="mx-auto"
          icon="fa-gift"
          naam="Rewards"
          :disabled="true"
        ></community-button>
      </v-col>
      <v-col>
        <community-button
          class="mx-auto"
          icon="fa-bullseye"
          naam="doelen"
          forward="charityOverviewPage"
        ></community-button>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import CommunityButton from '@/components/community/CommunityButton.vue'
import * as psStore from '@/store/profile-service'
import * as isStore from '@/store/itinerary-service'

export default {
  components: {
    CommunityButton: CommunityButton,
    ContentPane,
  },
  computed: {
    ...{ shoutOutsTotalCount: () => isStore.getters.getShoutOutsTotalCount },
  },
  mounted() {
    const address = psStore.getters.getProfile.address
    isStore.actions.fetchShoutOuts({
      latitude: address.location.coordinates[1],
      longitude: address.location.coordinates[0],
      maxResults: 0,
    })
  },
}
</script>
<style scoped></style>
