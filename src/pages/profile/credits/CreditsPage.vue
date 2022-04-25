<template>
  <content-pane scrollable @low="onLowWater">
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
        ><span :class="balanceColor(user.personalAccount.credits)">{{
          user.personalAccount.credits
        }}</span>
        credits</v-col
      >
      <v-col cols="3" class="text-right">{{
        amountInEuro(user.personalAccount.credits)
      }}</v-col>
    </v-row>
    <v-row v-if="user && user.premiumAccount" class="body-2">
      <v-col cols="5">
        Premiesaldo
        <a @click.stop="showPremiumDialog = true"
          ><v-icon>info</v-icon></a
        ></v-col
      >
      <v-col cols="4" class="text-right"
        ><span :class="balanceColor(user.premiumAccount.credits)">{{
          user.premiumAccount.credits
        }}</span>
        credits</v-col
      >
      <v-col cols="3" class="text-right">{{
        amountInEuro(user.premiumAccount.credits)
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
      v-if="user"
      :items="creditHistory.data"
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
    <v-dialog v-model="showPremiumDialog" scrollable>
      <v-card class="py-3 px-3">
        <v-card-title class="headline background-primary text-white"
          >Premiecredits</v-card-title
        >
        <v-card-text>
          <ul>
            <li>
              Ben je chauffeur? Dan ontvang je 50% extra credits voor je ritten,
              met een maximum van 15 credits per rit, totdat je premie op is.
            </li>
            <li>
              Ben je reiziger? Dan kun je met de premie betalen voor je ritten.
            </li>
            <li>
              Ben je zowel reiziger als chauffeur? Dan kun je de premie
              gebruiken om te betalen voor ritten of om extra credits te
              verdienen met je ritten.
            </li>
          </ul>
        </v-card-text>
        <v-card-actions class="justify-space-around">
          <v-btn
            large
            rounded
            outlined
            depressed
            color="primary"
            min-width="9em"
            @click="showPremiumDialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import CreditHistoryLine from '@/components/profile/CreditHistoryLine.vue'
import constants from '@/constants/constants'
import * as uiStore from '@/store/ui'
import * as bsStore from '@/store/banker-service'
import GroupedCardList from '@/components/common/GroupedCardList'
import { creditAmountInEuro } from '@/utils/Utils'
import moment from 'moment'

const { fetchBankerStatementsMaxResults } = constants

export default {
  name: 'CreditsPage',
  components: {
    ContentPane,
    CreditHistoryLine,
    GroupedCardList,
  },
  data() {
    return {
      showPremiumDialog: false,
      until: null,
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
      return bsStore.getters.getAccountStatements
    },
    exchangeRate() {
      return bsStore.getters.getBankerSettings?.exchangeRate ?? 0
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    bsStore.actions.fetchBankerUser()
    bsStore.actions.fetchBankerSettings()
    // fetch first page with statements
    this.until = moment().format()
    this.fetchCreditHistory()
  },
  methods: {
    fetchCreditHistory(offset = 0) {
      if (offset === 0 || offset < this.creditHistory.totalCount) {
        bsStore.actions.fetchUserStatements({
          offset,
          maxResult: fetchBankerStatementsMaxResults,
          until: this.until,
        })
      }
    },
    amountInEuro(amountInCredits) {
      return creditAmountInEuro(amountInCredits, this.exchangeRate)
    },
    balanceColor(balance) {
      return balance >= 0 ? 'text-green' : 'text-red'
    },
    onLowWater() {
      // fetch more statements when window bottom is visible
      this.fetchCreditHistory(this.creditHistory.data.length)
    },
  },
}
</script>
<style lang="scss" scoped>
.text-white {
  color: $color_white;
}
.text-green {
  color: $color-green;
}
.text-red {
  color: $color-alertRed;
}
</style>
