<template>
  <v-form ref="form" v-model="valid" lazy-validation class="full-height">
    <content-pane>
      <v-row dense>
        <v-col>
          <h1>Credits opnemen</h1>
        </v-col>
      </v-row>
      <v-row v-if="bankSimulated">
        <v-col>
          <v-alert type="warning"> Banksimulatie is actief. </v-alert>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          Je kunt Netmobiel omwisselen voor euro's.<br />
          Eén credit is {{ exchangeRate }} eurocent waard.
        </v-col>
      </v-row>
      <v-row dense class="align-center">
        <v-col> Hoeveel credits wil je opnemen? </v-col>
        <v-col cols="3">
          <v-text-field
            v-model.number="creditAmount"
            single-line
            :rules="[rules.required, rules.minAmount, rules.maxAmount]"
            outlined
            dense
            type="number"
            hide-details="auto"
            hide-spin-buttons
          />
        </v-col>
        <v-col cols="3" class="text-center">
          {{ amountInEuro(creditAmount) }}
        </v-col>
      </v-row>
      <v-row dense>
        <v-col class="text-body-2">
          <span v-if="isIbanPresent === true">
            {{ friendlyIBAN }} t.n.v. {{ account.ibanHolder }}
          </span>
          <div v-else class="red--text">
            <span class="mr-4">Rekeninggegevens zijn onvolledig.</span>
            <v-btn
              to="/account"
              large
              rounded
              depressed
              outlined
              color="primary"
            >
              Aanvullen
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea
            v-model="description"
            class="bg-white"
            outlined
            dense
            rows="3"
            label="Omschrijving"
            :rules="[rules.required]"
            hide-details="auto"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row class="text-center">
        <v-col>
          <v-btn large rounded outlined color="primary" @click="$router.go(-1)">
            Annuleren
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            large
            rounded
            depressed
            :disabled="!valid || isIbanPresent !== true"
            color="button"
            min-width="9em"
            @click="createWithdrawalRequest()"
          >
            Opnemen
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
import * as ibantools from 'ibantools'
import { creditAmountInEuro } from '@/utils/Utils'

const MIN_AMOUNT = 10
const MAX_AMOUNT = 1000

export default {
  name: 'WithdrawalPage',
  components: {
    ContentPane,
  },
  data: function () {
    return {
      valid: false,
      creditAmount: MIN_AMOUNT,
      bankSimulated: config.BANK_SIMULATED || false,
      description: 'Inwisselen van Netmobiel credits',
      rules: {
        required: (value) => !!value || 'Veld is verplicht',
        minAmount: (value) =>
          value >= this.modifiedMinAmount ||
          `Minimaal ${this.modifiedMinAmount}`,
        maxAmount: (value) =>
          value <= this.modifiedMaxAmount ||
          `Maximaal ${this.modifiedMaxAmount}`,
        ibanPresent: () => this.isIbanPresent,
      },
    }
  },
  computed: {
    // You cannot withdraw more than available in your account
    // and also not more than the maximum we have defined.
    modifiedMaxAmount() {
      return Math.min(this.account?.credits ?? MAX_AMOUNT, MAX_AMOUNT)
    },
    // There is a minumum amount, but it is allowed to withdraw the rest of your
    // account if the total amount in the account is less than the MIN_AMOUNT
    modifiedMinAmount() {
      return Math.min(this.account?.credits ?? MIN_AMOUNT, MIN_AMOUNT)
    },
    bankerUser() {
      return bsStore.getters.getBankerUser
    },
    exchangeRate() {
      return bsStore.getters.getBankerSettings?.exchangeRate ?? 0
    },
    account() {
      return this.bankerUser?.personalAccount
    },
    friendlyIBAN() {
      return this.account?.iban
        ? ibantools.friendlyFormatIBAN(this.account.iban)
        : ''
    },
    isIbanPresent() {
      if (!this.account) {
        // Temporary issue, don't flash error message
        return false
      }
      return !this.account.iban
        ? 'Voeg IBAN rekening toe'
        : !this.account.ibanHolder
        ? 'Voeg naam rekeninghouder toe'
        : true
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    bsStore.actions.fetchBankerSettings()
    // Fetch me from the banker service
    bsStore.actions.fetchBankerUser()
  },
  methods: {
    validate() {
      return this.$refs.form.validate()
    },
    amountInEuro(amountInCredits) {
      return creditAmountInEuro(amountInCredits, this.exchangeRate)
    },
    createWithdrawalRequest() {
      if (!this.validate()) {
        return
      }
      const wr = {
        description: this.description,
        amountCredits: this.creditAmount,
      }
      // Credits are taken from the user's personal account
      bsStore.actions
        .withdrawCreditsFromMyAccount(wr)
        .then(this.routeToOverviewOnSuccess)
    },
    routeToOverviewOnSuccess(result) {
      if (result) {
        this.$router.push({
          name: 'withdrawalOverviewPage',
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped></style>
