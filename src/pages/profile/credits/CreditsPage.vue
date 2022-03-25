<template>
  <content-pane scrollable>
    <v-row>
      <v-col>
        <h1>Credits</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-divider />
    </v-row>
    <v-row v-if="user && user.personalAccount" class="body-2">
      <v-col cols="5"> Vrij saldo </v-col>
      <v-col cols="4" class="text-right"
        >{{ user.personalAccount.credits }} credits</v-col
      >
      <v-col cols="3" class="text-right">{{
        amountInEuro(user.personalAccount.credits)
      }}</v-col>
    </v-row>
    <v-row v-if="user && user.premiumAccount" class="body-2">
      <v-col cols="5"> Premiesaldo </v-col>
      <v-col cols="4" class="text-right"
        >{{ user.premiumAccount.credits }} credits</v-col
      >
      <v-col cols="3" class="text-right">{{
        amountInEuro(user.premiumAccount.credits)
      }}</v-col>
    </v-row>
    <v-row v-if="premiumAccount" class="body-2">
      <v-col cols="5"> Saldo premieuitgifte </v-col>
      <v-col cols="4" class="text-right"
        >{{ premiumAccount.credits }} credits</v-col
      >
      <v-col cols="3" class="text-right">{{
        amountInEuro(premiumAccount.credits)
      }}</v-col>
    </v-row>
    <v-row>
      <v-divider />
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          rounded
          outlined
          color="primary"
          @click="$router.push('/charityOverviewPage')"
        >
          Doel steunen
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          rounded
          block
          outlined
          color="primary"
          @click="$router.push('/rewardOverviewPage')"
        >
          Beloningen
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          rounded
          block
          outlined
          color="primary"
          @click="$router.push('/withdrawalOverviewPage')"
        >
          Opnames
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          large
          rounded
          block
          depressed
          color="button"
          @click="$router.push('/addCredits')"
        >
          Credits toevoegen
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-divider />
    </v-row>

    <grouped-card-list
      :items="creditHistory"
      :get-date="(t) => t.transactionTime"
    >
      <template #card="{ item, index }">
        <credit-history-line
          :index="index"
          :statement="item"
          :user="user"
          :account="account"
        ></credit-history-line>
      </template>
    </grouped-card-list>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import CreditHistoryLine from '@/components/profile/CreditHistoryLine.vue'
import constants from '@/constants/constants'
import { isBottomVisible } from '@/utils/scroll'
import * as uiStore from '@/store/ui'
import * as bsStore from '@/store/banker-service'
import * as psStore from '@/store/profile-service'
import GroupedCardList from '@/components/common/GroupedCardList'

const { fetchBankerStatementsMaxResults } = constants
const euroFormatter = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
})

export default {
  name: 'CreditsPage',
  components: {
    ContentPane,
    CreditHistoryLine,
    GroupedCardList,
  },
  data() {
    return {
      bottom: false,
      // eslint-disable-next-line no-unused-vars
      scrollHandler: (event) => {
        this.bottom = isBottomVisible()
      },
    }
  },
  computed: {
    user() {
      return bsStore.getters.getBankerUser
    },
    account() {
      return this.user?.personalAccount
    },
    creditAmount() {
      return this.user?.personalAccount?.credits ?? 0
    },
    creditHistory() {
      return bsStore.getters.getAccountStatements?.data ?? []
    },
    exchangeRate() {
      return bsStore.getters.getBankerSettings?.exchangeRate ?? 0
    },
    premiumAccountNcan() {
      // Name of the system account for distributing premiums
      return 'premiums'
    },
    premiumAccount() {
      return bsStore.getters.getSystemAccounts?.data.find(
        (acc) => acc.ncan === this.premiumAccountNcan
      )
    },
    canActAsTreasurer() {
      return psStore.getters.canActAsTreasurer
    },
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        // fetch more statements when window bottom is visible
        bsStore.actions.fetchMoreAccountStatements(
          fetchBankerStatementsMaxResults
        )
      }
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    bsStore.actions.fetchBankerUser()
    bsStore.actions.fetchBankerSettings()
    // fetch first page with statements
    bsStore.actions.fetchFirstAccountStatements(fetchBankerStatementsMaxResults)
    if (this.canActAsTreasurer) {
      bsStore.actions.fetchSystemAccounts()
    }
  },
  mounted() {
    window.addEventListener('scroll', this.scrollHandler)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollHandler)
  },
  methods: {
    amountInEuro(amount) {
      return euroFormatter.format(((amount || 0) * this.exchangeRate) / 100)
    },
  },
}
</script>
<style lang="scss"></style>
