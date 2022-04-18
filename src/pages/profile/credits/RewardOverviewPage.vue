<template>
  <content-pane scrollable @low="onLowWater">
    <v-row>
      <v-col>
        <h1>Beloningen</h1>
      </v-col>
    </v-row>
    <v-row v-if="rewardHistory && rewardHistory.length === 0">
      <v-col>Je hebt nog geen beloningen ontvangen.</v-col>
    </v-row>
    <grouped-card-list
      v-else
      :items="rewardHistory"
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

export default {
  name: 'RewardOverviewPage',
  components: { ContentPane, GroupedCardList, RewardHistoryLine },
  computed: {
    rewardHistory() {
      return bsStore.getters.getRewards?.data ?? []
    },
    user() {
      return bsStore.getters.getBankerUser
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    bsStore.actions.fetchBankerUser()
    bsStore.actions.fetchUserRewards()
  },
  methods: {
    onLowWater() {
      // console.log(`Add more content`)
    },
  },
}
</script>

<style lang="scss" scoped></style>
