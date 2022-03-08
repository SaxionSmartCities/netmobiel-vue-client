<template>
  <content-pane>
    <v-row align="center" justify="center">
      <v-col>
        <v-img
          :src="charityImage"
          class="goal-jumbo-image"
          max-width="500"
          max-height="500"
        >
          <template #placeholder>
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
    <v-row dense>
      <v-col>
        <h1 class="netmobiel">{{ charityName }}</h1>
        <span class="caption">{{ charityLocation }}</span>
      </v-col>
    </v-row>
    <v-row v-if="charity" dense>
      <v-col>
        <span>{{ charity.description ? charity.description : '' }}</span>
      </v-col>
    </v-row>
    <v-row v-if="charity" dense class="">
      <v-col>
        <span>Looptijd: {{ formatDate(charity.campaignStartTime) }}</span>
        <span v-if="charity.campaignEndTime">
          - {{ formatDate(charity.campaignEndTime) }}</span
        >
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <goal-progress-bar name="Donateurs" :value-current="totalDonors" />
      </v-col>
      <v-col>
        <goal-progress-bar name="Credits" :value-current="donatedAmount">
        </goal-progress-bar>
      </v-col>
      <v-col>
        <goal-progress-bar
          name="Behaald"
          :display-percentage="true"
          :value-current="donatedAmount"
          :value-total="goalAmount"
        >
        </goal-progress-bar>
      </v-col>
    </v-row>
    <v-row dense>
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
        <h6 class="text-color-primary text-uppercase my-3 mb-2">Donateurs</h6>
        <v-divider />
        <donation-list v-if="donations" :donations="donations"></donation-list>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import GoalProgressBar from '@/components/community/charity/GoalProgressBar'
import * as uiStore from '@/store/ui'
import * as chsStore from '@/store/charity-service'
import DonationList from '@/components/community/charity/DonationList'
import moment from 'moment'
import defaultCharityImage from '@/assets/achterhoek_background.jpg'
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
    charityImage() {
      return this.charity?.imageUrl
        ? this.charity?.imageUrl
        : defaultCharityImage
    },
    donations() {
      return chsStore.getters.getSelectedCharityDonations
    },
    charityName() {
      return this.charity?.name || ''
    },
    charityLocation() {
      return this.charity?.location?.label || ''
    },
    totalDonors() {
      return this.donations?.length || 0
    },
    donatedAmount() {
      return this.charity?.donatedAmount || 0
    },
    goalAmount() {
      return this.charity?.goalAmount || 1
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    chsStore.actions.fetchCharity(this.id)
    chsStore.actions.fetchDonationsForCharity(this.id)
  },
  methods: {
    supportCharity() {
      this.$router.push({ name: 'supportGoal' })
    },
    formatDate(date) {
      return date ? moment(date).locale('nl').format('D MMM YYYY') : ''
    },
  },
}
</script>

<style scoped>
.goal-jumbo-image {
  border-radius: 10px;
}
</style>
