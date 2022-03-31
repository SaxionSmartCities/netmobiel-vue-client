<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Opnames</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          rounded
          outlined
          color="primary"
          @click="$router.push('/newWithdrawal')"
        >
          Nieuwe Opname
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="withdrawalHistory && withdrawalHistory.length === 0">
      <v-col>Je hebt nog geen opnames gedaan.</v-col>
    </v-row>
    <grouped-card-list
      v-else
      :items="withdrawalHistory"
      :get-date="(w) => w.creationTime"
    >
      <template #card="{ item, index }">
        <withdrawal-history-line
          :index="index"
          :withdrawal="item"
          :show-user="false"
          @cancel="onCancel(item)"
        ></withdrawal-history-line>
      </template>
    </grouped-card-list>
    <v-dialog v-model="showCancelDialog">
      <v-card class="py-1 px-3">
        <v-card-title class="headline">Verwijder Opdracht</v-card-title>
        <v-card-text>
          Wil je de opdracht annuleren om
          {{ withdrawalToCancel && withdrawalToCancel.amountCredits }} credits
          over te maken?
        </v-card-text>
        <v-card-actions class="justify-space-around">
          <v-btn
            large
            rounded
            depressed
            color="button"
            min-width="9em"
            @click="confirmCancellation"
          >
            Verwijderen
          </v-btn>
          <v-btn
            large
            rounded
            outlined
            depressed
            color="primary"
            min-width="9em"
            @click="closeCancelDialog"
          >
            Behouden
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import * as bsStore from '@/store/banker-service'
import * as uiStore from '@/store/ui'
import GroupedCardList from '@/components/common/GroupedCardList'
import WithdrawalHistoryLine from '@/components/profile/WithdrawalHistoryLine'

export default {
  name: 'WithdrawalOverviewPage',
  components: { ContentPane, GroupedCardList, WithdrawalHistoryLine },
  data() {
    return {
      showCancelDialog: false,
      withdrawalToCancel: null,
    }
  },
  computed: {
    withdrawalHistory() {
      return bsStore.getters.getWithdrawals?.data ?? []
    },
    user() {
      return bsStore.getters.getBankerUser
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    bsStore.actions.fetchBankerUser()
    bsStore.actions.fetchUserWithdrawals()
  },
  methods: {
    onCancel(wr) {
      this.withdrawalToCancel = wr
      this.showCancelDialog = true
    },
    confirmCancellation() {
      bsStore.actions
        .cancelUserWithdrawal(this.withdrawalToCancel.urn)
        .then((result) => {
          if (result) {
            this.showCancelDialog = false
            bsStore.actions.fetchUserWithdrawals()
          }
        })
    },
    closeCancelDialog() {
      this.showCancelDialog = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
