<template>
  <content-pane scrollable @low="onLowWater">
    <v-row>
      <v-col>
        <h1>Beloningen</h1>
      </v-col>
    </v-row>
    <v-row v-if="rewardHistory.data.length === 0">
      <v-col>Je hebt nog geen beloningen ontvangen.</v-col>
    </v-row>
    <grouped-card-list
      v-else
      :items="rewardHistory.data"
      :get-date="(r) => r.rewardTime"
    >
      <template #card="{ item, index }">
        <reward-history-line
          :index="index"
          :reward="item"
          :show-user="false"
        ></reward-history-line>
      </template>
    </grouped-card-list>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import * as bsStore from '@/store/banker-service'
import * as uiStore from '@/store/ui'
import GroupedCardList from '@/components/common/GroupedCardList'
import RewardHistoryLine from '@/components/profile/RewardHistoryLine.vue'
import moment from 'moment'
import constants from '@/constants/constants'

export default {
  name: 'RewardOverviewPage',
  components: { ContentPane, GroupedCardList, RewardHistoryLine },
  data() {
    return {
      until: null,
    }
  },
  computed: {
    rewardHistory() {
      return bsStore.getters.getRewards
    },
    user() {
      return bsStore.getters.getBankerUser
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    bsStore.actions.fetchBankerUser()
    this.until = moment().format()
    this.fetchRewardHistory()
  },
  methods: {
    fetchRewardHistory(offset = 0) {
      if (offset === 0 || offset < this.rewardHistory.totalCount) {
        bsStore.actions.fetchUserRewards({
          offset: offset,
          maxResults: constants.fetchRewardsMaxResults,
          until: this.until,
        })
      }
    },
    onLowWater() {
      this.fetchRewardHistory(this.rewardHistory.data.length)
    },
  },
}
</script>

<style lang="scss" scoped></style>
