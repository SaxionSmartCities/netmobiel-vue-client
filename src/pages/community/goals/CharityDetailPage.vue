<template>
  <content-pane scrollable @low="onLowWater">
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
        <h4 class="netmobiel my-2">Top donateurs</h4>
        <v-divider />
        <top-donor-list :donors="topDonors"></top-donor-list>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h4 class="netmobiel my-2">Donaties</h4>
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
import * as bsStore from '@/store/banker-service'
import DonationList from '@/components/community/charity/DonationList'
import moment from 'moment'
import defaultCharityImage from '@/assets/achterhoek_background.jpg'
import TopDonorList from '@/components/community/charity/TopDonorList'
import constants from '@/constants/constants'
import { emptyPage } from '@/store/storeHelper'
export default {
  name: 'CharityDetailPage',
  components: { DonationList, ContentPane, GoalProgressBar, TopDonorList },
  props: {
    id: { type: String, required: true },
  },
  computed: {
    charity() {
      return bsStore.getters.getSelectedCharity
    },
    charityImage() {
      return this.charity?.imageUrl
        ? this.charity?.imageUrl
        : defaultCharityImage
    },
    donations() {
      return bsStore.getters.getSelectedCharityDonations.data
    },
    charityName() {
      return this.charity?.name || ''
    },
    charityLocation() {
      return this.charity?.location?.label || ''
    },
    totalDonors() {
      // In the detail page there is only one popular charity: The current one
      return this.popularCharities.length > 0
        ? this.popularCharities[0].donorCount
        : 0
    },
    donatedAmount() {
      return this.charity?.donatedAmount || 0
    },
    goalAmount() {
      return this.charity?.goalAmount || 1
    },
    popularCharities() {
      return bsStore.getters.getPopularCharities.data
    },
    topDonors() {
      return bsStore.getters.getTopDonors.data
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    bsStore.actions.fetchCharity(this.id)
    bsStore.mutations.setPopularCharities(emptyPage)
    bsStore.actions.fetchPopularCharities({ charity: this.id })
    bsStore.actions.fetchTopDonors({
      charity: this.id,
      maxResults: constants.fetchCharityDetailTopDonorsMaxResults,
    })
    this.fetchCharityDonations()
  },
  methods: {
    fetchCharityDonations(offset = 0) {
      bsStore.actions.fetchDonationsForCharity({
        charityId: this.id,
        offset: offset,
        maxResults: constants.fetchCharityDetailDonationsMaxResults,
      })
    },
    supportCharity() {
      this.$router.push({ name: 'supportGoal' })
    },
    formatDate(date) {
      return date ? moment(date).locale('nl').format('D MMM YYYY') : ''
    },
    onLowWater() {
      if (
        this.donations.length <
        bsStore.getters.getSelectedCharityDonations.totalCount
      ) {
        this.fetchCharityDonations(this.donations.length)
      }
    },
  },
}
</script>

<style scoped>
.goal-jumbo-image {
  border-radius: 10px;
}
</style>
