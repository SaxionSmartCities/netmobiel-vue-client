<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Je oproep is verstuurd 🎉</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="py-0">
        Oproepen vind je terug onder de tab 'Community'.
      </v-col>
    </v-row>
    <v-row class="mb-2">
      <v-col>
        <shout-out
          :shout-out="shoutOut"
          @shoutOutSelected="onShoutOutSelected"
        ></shout-out>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          block
          rounded
          depressed
          outlined
          color="primary"
          to="/modeSelection"
        >
          Plan een nieuwe rit
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import ShoutOut from '@/components/community/ShoutOut'
import * as psStore from '@/store/profile-service'
import * as isStore from '@/store/itinerary-service'

export default {
  name: 'ShoutOutSubmittedPage',
  components: { ContentPane, ShoutOut },
  props: {
    shoutOutId: { type: String, required: true },
  },
  computed: {
    shoutOut() {
      return isStore.getters.getSelectedTripPlan
    },
  },
  mounted() {
    isStore.mutations.clearPlanningResults()
    isStore.mutations.setSelectedTripPlan({})
    // For a traveller a shout-out is just another trip plan.
    isStore.actions.fetchTripPlan({ id: this.shoutOutId })
  },
  methods: {
    onShoutOutSelected() {
      this.$router.push({
        name: 'shoutOutPassenger',
        params: { shoutOutId: this.shoutOutId },
      })
    },
  },
}
</script>

<style lang="scss"></style>
