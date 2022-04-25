<template>
  <content-pane scrollable @low="onLowWater">
    <template #header>
      <tab-bar
        :num-tabs="3"
        :selected-tab-model="selectedTab"
        @tabChange="(n) => (selectedTab = n)"
      >
        <template #firstTab>
          <span> Premies </span>
        </template>
        <template #secondTab>
          <span> Reserveringen </span>
        </template>
        <template #thirdTab>
          <span> Kas </span>
        </template>
      </tab-bar>
    </template>
    <v-row dense>
      <v-col>
        <h1>{{ selectedTabEntry.title }}</h1>
        <div class="caption">{{ selectedTabEntry.description }}</div>
      </v-col>
    </v-row>
    <v-row>
      <v-divider />
    </v-row>
    <v-row v-if="selectedAccount" class="body-2">
      <v-col cols="5"> Saldo </v-col>
      <v-col cols="4" class="text-right"
        >{{ selectedAccount.credits }} credits</v-col
      >
      <v-col cols="3" class="text-right">{{
        amountInEuro(selectedAccount.credits)
      }}</v-col>
    </v-row>
    <v-row v-if="selectedAccount">
      <v-divider />
    </v-row>
    <v-row v-if="selectedTabEntry.transaction">
      <v-col class="text-center">
        <v-btn
          large
          rounded
          outlined
          color="primary"
          @click="$router.push('/premiumWithdrawalPage')"
        >
          Verlagen
        </v-btn>
      </v-col>
      <v-col class="text-center">
        <v-btn
          large
          rounded
          depressed
          color="button"
          @click="$router.push('/premiumDepositPage')"
        >
          Verhogen
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-divider />
    </v-row>
    <v-row class="align-center">
      <v-col cols="6" class="text-right"> Filter lijst </v-col>
      <v-col class="text-right">
        <v-select
          v-model="selectedPurpose"
          :items="purposeList"
          prepend-icon="fa-filter"
          label="Filter"
          return-object
          single-line
          hide-details
          outlined
          dense
        ></v-select>
      </v-col>
    </v-row>
    <grouped-card-list
      v-if="selectedAccount"
      :items="creditHistory.data"
      :get-date="(t) => t.transactionTime"
    >
      <template #card="{ item, index }">
        <credit-history-line
          :index="index"
          :statement="item"
          :account="selectedAccount"
        ></credit-history-line>
      </template>
    </grouped-card-list>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import CreditHistoryLine from '@/components/profile/CreditHistoryLine.vue'
import * as uiStore from '@/store/ui'
import * as bsStore from '@/store/banker-service'
import GroupedCardList from '@/components/common/GroupedCardList'
import TabBar from '@/components/common/TabBar'
import { creditAmountInEuro } from '@/utils/Utils'
import constants from '@/constants/constants'
import moment from 'moment'
import { emptyPage } from '@/store/storeHelper'

const { fetchBankerStatementsMaxResults } = constants

const SYSTEM_ACCOUNTS = [
  // 0
  {
    ncan: constants.PREMIUM_ACCOUNT_NCAN,
    title: 'Premieuitgifte',
    transaction: true,
    description: `Het beschikbaar aantal credits voor het belonen van deelnemers voor het volbrengen van bepaalde taken`,
    purposes: ['DEPOSIT', 'WITHDRAWAL', 'PAYMENT', 'REFUND'],
  },
  // 1
  {
    ncan: constants.RESERVATIONS_ACCOUNT_NCAN,
    title: 'Reserveringen',
    transaction: false,
    description: `Het aantal credits dat door deelnemers is gereserveerd
      vanwege geoormerkte premies, geboekte ritten en voorgenomen opnames`,
    purposes: ['RESERVATION', 'RELEASE'],
  },
  // 2
  {
    ncan: constants.BANKING_ACCOUNT_NCAN,
    title: 'Kas',
    transaction: false,
    description: `Het balanstotaal van de boekhouding. Dit aantal euro's moet minimaal op de bankrekening staan`,
    purposes: ['DEPOSIT', 'WITHDRAWAL'],
  },
]
const PURPOSE_LIST = [
  { text: 'Toon alles', value: undefined },
  { text: 'Storting', value: 'DEPOSIT' },
  { text: 'Opname', value: 'WITHDRAWAL' },
  { text: 'Reservering', value: 'RESERVATION' },
  { text: 'Vrijgave', value: 'RELEASE' },
  { text: 'Betaling', value: 'PAYMENT' },
  { text: 'Terugbetaling', value: 'REFUND' },
]
export default {
  name: 'SystemCreditsPage',
  components: {
    ContentPane,
    CreditHistoryLine,
    GroupedCardList,
    TabBar,
  },
  data() {
    return {
      selectedPurpose: {},
      selectedTab: 0,
      until: null,
    }
  },
  computed: {
    selectedTabEntry() {
      return SYSTEM_ACCOUNTS[this.selectedTab]
    },
    purposeList() {
      const specificPurposes = this.selectedTabEntry
        ? PURPOSE_LIST.filter((p) =>
            this.selectedTabEntry.purposes.includes(p.value)
          )
        : []
      return [PURPOSE_LIST[0]].concat(specificPurposes)
    },
    selectedAccount() {
      return this.systemAccounts.data.find(
        (acc) => acc.ncan === this.selectedTabEntry.ncan
      )
    },
    creditHistory() {
      return bsStore.getters.getAccountStatements
    },
    exchangeRate() {
      return bsStore.getters.getBankerSettings?.exchangeRate ?? 0
    },
    systemAccounts() {
      return bsStore.getters.getSystemAccounts
    },
  },
  watch: {
    selectedTab() {
      this.selectedPurpose = PURPOSE_LIST[0]
    },
    selectedAccount() {
      bsStore.mutations.setAccountStatements(emptyPage)
      this.fetchCreditHistory()
    },
    selectedPurpose() {
      if (this.selectedAccount) {
        bsStore.mutations.setAccountStatements(emptyPage)
        this.fetchCreditHistory()
      }
    },
  },
  created() {
    this.selectedPurpose = this.purposeList[0]
    uiStore.mutations.showBackButton()
    bsStore.actions.fetchBankerSettings()
    bsStore.mutations.setAccountStatements(emptyPage)
    bsStore.actions.fetchSystemAccounts()
    this.until = moment().format()
  },
  methods: {
    fetchCreditHistory(offset = 0) {
      if (offset === 0 || offset < this.creditHistory.totalCount) {
        // To avoid inconsistent paging, add the until parameter
        bsStore.actions.fetchStatements({
          accountId: this.selectedAccount.id,
          purpose: this.selectedPurpose.value,
          maxResults: fetchBankerStatementsMaxResults,
          until: this.until,
          offset: offset,
        })
      }
    },
    amountInEuro(amountInCredits) {
      return creditAmountInEuro(amountInCredits, this.exchangeRate)
    },
    onLowWater() {
      // fetch more statements when window bottom is visible
      this.fetchCreditHistory(this.creditHistory.data.length)
    },
  },
}
</script>
<style lang="scss"></style>
