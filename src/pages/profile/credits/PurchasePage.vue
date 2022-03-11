<template>
  <content-pane>
    <v-row dense>
      <v-col>
        <h3>Credits inkopen</h3>
      </v-col>
    </v-row>
    <v-row v-if="bankSimulated">
      <v-col>
        <v-alert type="warning">
          In de huidige testfase van de Netmobiel-app hoef je nog niet écht te
          betalen voor credits. Wel heb je de fictieve credits nodig om ritten
          te boeken. Het aankoopproces dat je straks doorloopt is slechts een
          simulatie en het kost je helemaal niks! Spreek onderling met de
          chauffeur een eventuele vergoeding af.
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        Je kunt Netmobiel credits inkopen via iDEAL.<br />
        Eén credit kost {{ CREDIT_IN_EUROCENTS }} eurocent.
      </v-col>
    </v-row>
    <v-row>
      <v-col> Hoeveel credits wil je inkopen? </v-col>
      <v-col>
        <v-text-field
          v-model.number="creditAmount"
          class="border-radius-input"
          single-line
          :min="MIN_AMOUNT"
          :max="MAX_AMOUNT"
          type="number"
        />
      </v-col>
    </v-row>
    <v-row v-if="canActAsTreasurer && premiumAccount">
      <v-col> Welke rekening wil je aanvullen met credits? </v-col>
      <v-col class="">
        <v-radio-group v-model="account">
          <v-radio label="Persoonlijk" value="personal" />
          <v-radio label="Premierekening" :value="premiumAccountNcan" />
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          large
          rounded
          block
          depressed
          :disable="!isValidAmount"
          color="button"
          @click="startMoneyTransfer()"
        >
          Betaal met iDEAL
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'
import * as bsStore from '@/store/banker-service'
import * as uiStore from '@/store/ui'
import config from '@/config/config'
import * as psStore from '@/store/profile-service'

const MIN_AMOUNT = 10
const MAX_AMOUNT = 1000

export default {
  name: 'PurchasePage',
  components: {
    ContentPane,
  },
  data: function () {
    return {
      creditAmount: MIN_AMOUNT,
      bankSimulated: config.BANK_SIMULATED || false,
      account: 'personal',
    }
  },
  computed: {
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
    isValidAmount() {
      const { creditAmount } = this
      return creditAmount >= MIN_AMOUNT && creditAmount <= MAX_AMOUNT
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    this.MIN_AMOUNT = MIN_AMOUNT
    this.MAX_AMOUNT = MAX_AMOUNT
    this.CREDIT_IN_EUROCENTS =
      bsStore.getters.getBankerSettings?.exchangeRate ?? 0
    if (this.canActAsTreasurer) {
      bsStore.actions.fetchSystemAccounts()
    }
  },
  methods: {
    startMoneyTransfer() {
      const deposit = {
        description: `${this.creditAmount} credits inkopen voor NetMobiel`,
        amountCredits: this.creditAmount,
        returnUrl: new URL('wait-for-deposit-confirmation', location.href),
      }
      if (this.account === this.premiumAccountNcan) {
        // Deposit to a system account, use the privileged call
        deposit.accountId = this.premiumAccount.id
        bsStore.actions.depositCredits(deposit).then((data) => {
          // follow payment URL in current window
          location = data.paymentUrl
        })
      } else {
        // Credits go to the user's personal account
        bsStore.actions.depositCreditsToMyAccount(deposit).then((data) => {
          // follow payment URL in current window
          location = data.paymentUrl
        })
      }
    },
  },
}
</script>
<style lang="scss"></style>
