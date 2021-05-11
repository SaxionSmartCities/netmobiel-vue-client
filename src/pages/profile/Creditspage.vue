<template>
  <content-pane>
    <v-row align="center">
      <v-col class="px-0">
        <h3>Credits</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-divider />
    </v-row>
    <v-row align="center">
      <v-col class="px-0 body-1 shrink">
        <strong>Saldo</strong>
      </v-col>
      <v-col class="body-2">{{ creditAmount }} credits</v-col>
      <v-col class="body-2">({{ euroAmount }})</v-col>
    </v-row>
    <v-row>
      <v-divider />
    </v-row>
    <v-row align="center">
      <v-col class="px-0">
        <v-btn
          rounded
          outlined
          color="primary"
          @click="$router.push('/charityOverviewPage')"
        >
          Doel steunen
        </v-btn>
      </v-col>
      <v-col class="px-0">
        <v-btn
          rounded
          block
          outlined
          disabled
          color="primary"
          @click="$router.push('/addCredits')"
        >
          Beloningen
        </v-btn>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col class="px-0">
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
    <v-row align="center">
      <v-col class="px-0">
        <h3 class="text-uppercase caption text-color-primary">overzicht</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-divider />
    </v-row>
    <v-row v-for="(statement, index) in creditHistory" :key="index">
      <credit-history-line :statement="statement"></credit-history-line>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import CreditHistoryLine from '@/components/profile/CreditHistoryLine.vue'
import constants from '@/constants/constants'
import { isBottomVisible } from '@/utils/scroll'
import * as uiStore from '@/store/ui'
import * as crsStore from '@/store/credits-service'

const { fetchBankerStatementsMaxResults } = constants
const euroFormatter = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
})

export default {
  name: 'Credits',
  components: {
    ContentPane,
    CreditHistoryLine,
  },
  data() {
    return {
      bottom: false,
      scrollHandler: event => {
        this.bottom = isBottomVisible()
      },
    }
  },
  computed: {
    creditAmount() {
      return crsStore.getters.getBankerUser?.personalAccount?.credits
    },
    creditHistory() {
      return crsStore.getters.getAccountStatements?.data
    },
    exchangeRate() {
      return crsStore.getters.getBankerSettings?.exchangeRate
    },
    euroAmount() {
      return euroFormatter.format((this.creditAmount * this.exchangeRate) / 100)
    },
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        // fetch more statements when window bottom is visible
        crsStore.actions.fetchMoreAccountStatements(
          fetchBankerStatementsMaxResults
        )
      }
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    crsStore.actions.fetchBankerUser()
    crsStore.actions.fetchBankerSettings()
    // fetch first page with statements
    crsStore.actions.fetchFirstAccountStatements(
      fetchBankerStatementsMaxResults
    )
  },
  mounted() {
    window.addEventListener('scroll', this.scrollHandler)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollHandler)
  },
}
</script>
<style lang="scss"></style>
