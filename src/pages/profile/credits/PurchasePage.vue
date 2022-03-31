<template>
  <v-form ref="form" v-model="valid" class="full-height">
    <content-pane>
      <v-row dense>
        <v-col>
          <h1>Credits inkopen</h1>
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
      <v-row dense>
        <v-col>
          Je kunt Netmobiel credits inkopen via iDEAL.<br />
          Eén credit kost {{ exchangeRate }} eurocent.
        </v-col>
      </v-row>
      <v-row dense>
        <v-col> Hoeveel credits wil je inkopen? </v-col>
        <v-col>
          <v-text-field
            v-model.number="creditAmount"
            class="border-radius-input"
            single-line
            :rules="[rules.required, rules.minAmount, rules.maxAmount]"
            type="number"
          />
        </v-col>
      </v-row>
      <v-row
        v-if="canActAsTreasurer && premiumAccount"
        dense
        class="align-center"
      >
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
            :disabled="!valid"
            color="button"
            @click="startMoneyTransfer()"
          >
            Betaal met iDEAL
          </v-btn>
        </v-col>
      </v-row>
    </content-pane>
  </v-form>
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
      valid: false,
      creditAmount: MIN_AMOUNT,
      bankSimulated: config.BANK_SIMULATED || false,
      account: 'personal',
      rules: {
        required: (value) => !!value || 'Veld is verplicht',
        minAmount: (value) => value >= MIN_AMOUNT || `Minimaal ${MIN_AMOUNT}`,
        maxAmount: (value) => value <= MAX_AMOUNT || `Maximaal ${MAX_AMOUNT}`,
      },
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
    exchangeRate() {
      return bsStore.getters.getBankerSettings?.exchangeRate ?? 0
    },
  },
  created() {
    uiStore.mutations.showBackButton()
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
