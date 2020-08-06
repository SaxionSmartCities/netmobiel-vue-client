<template>
  <content-pane>
    <v-row align="center" justify="center">
      <v-col>
        <v-img
          src="@/assets/achterhoek_background.jpg"
          lazy-src="https://picsum.photos/id/11/100/60"
          aspect-ratio="1"
          class="goal-jumbo-image"
          max-width="500"
          max-height="300"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pt-0">
        <h1 class="netmobiel">{{ charity ? charity.name : '' }}</h1>
        <span class="overline">{{ charity ? charity.place : '' }}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pt-0">
        <span class="body-1">{{ charity ? charity.description : '' }}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <goal-progress-bar name="Donateurs" :value-current="49">
        </goal-progress-bar>
      </v-col>
      <v-col>
        <goal-progress-bar name="Credits" :value-current="6">
        </goal-progress-bar>
      </v-col>
      <v-col>
        <goal-progress-bar
          name="Behaald"
          :display-percentage="true"
          :value-current="40"
          :value-total="60"
        >
        </goal-progress-bar>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          large
          rounded
          block
          mb-4
          depressed
          color="button"
          @click="supportCharity()"
        >
          Steun dit doel
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h6 class="text-color-primary text-uppercase mt-3 mb-2">
          Donateurs
        </h6>
        <v-divider />
        <donation-list v-if="donations" :donations="donations"></donation-list>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import GoalProgressBar from '@/components/community/goals/GoalProgressBar'
import * as uiStore from '@/store/ui'
import * as chsStore from '@/store/charity-service'
import DonationList from '@/components/community/charity/DonationList'

export default {
  name: 'CharityDetailPage',
  components: { DonationList, ContentPane, GoalProgressBar },
  props: {
    id: { type: String, required: true },
  },
  computed: {
    charity() {
      return chsStore.getters.getSelectedCharity
    },
    donations() {
      return chsStore.getters.getSelectedCharityDonations
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    chsStore.actions.lookupCharity(this.id)
    chsStore.actions.fetchDonationsFromCharity(this.id)
  },
  methods: {
    supportCharity() {
      this.$router.push({ name: 'supportGoal' })
    },
  },
}
</script>

<style scoped>
.goal-jumbo-image {
  border-radius: 10px;
}
</style>
