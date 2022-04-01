<template>
  <v-form ref="form" v-model="valid" class="full-height">
    <content-pane>
      <v-row>
        <v-col>
          <h1>Premiesaldo Verlagen</h1>
          <div class="caption">
            Door premie weg te halen worden beloningen niet langer uitbetaald
            aan de deelnemers. De dekking van de bankrekening van je organisatie
            kun je evenredig verlagen.
          </div>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col> Eén credit kost {{ exchangeRate }} eurocent. </v-col>
      </v-row>
      <v-row dense class="align-center">
        <v-col> Hoeveel premie wil je weghalen? </v-col>
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
            :disabled="!valid"
            color="button"
            @click="removeCredits()"
          >
            Verlagen
          </v-btn>
        </v-col>
      </v-row>
    </content-pane>
  </v-form>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import * as bsStore from '@/store/banker-service'
import * as uiStore from '@/store/ui'
import { creditAmountInEuro } from '@/utils/Utils'

const MIN_AMOUNT = 1
const MAX_AMOUNT = 50000
const PREMIUM_ACCOUNT_NCAN = 'premiums'

export default {
  name: 'PremiumWithdrawalPage',
  components: { ContentPane },
  data() {
    return {
      valid: false,
      description: 'Verlagen saldo premieuitgifte',
      creditAmount: MIN_AMOUNT,
      rules: {
        required: (value) => !!value || 'Veld is verplicht',
        minAmount: (value) =>
          value >= this.modifiedMinAmount ||
          `Minimaal ${this.modifiedMinAmount}`,
        maxAmount: (value) =>
          value <= this.modifiedMaxAmount ||
          `Maximaal ${this.modifiedMaxAmount}`,
      },
    }
  },
  computed: {
    // You cannot withdraw more than available in the account
    // and also not more than the maximum we have defined.
    modifiedMaxAmount() {
      return Math.min(this.premiumsAccount?.credits ?? MAX_AMOUNT, MAX_AMOUNT)
    },
    // There is a minumum amount, but it is allowed to withdraw the rest of your
    // account if the total amount in the account is less than the MIN_AMOUNT
    modifiedMinAmount() {
      return Math.min(this.premiumsAccount?.credits ?? MIN_AMOUNT, MIN_AMOUNT)
    },
    exchangeRate() {
      return bsStore.getters.getBankerSettings?.exchangeRate ?? 0
    },
    systemAccounts() {
      return bsStore.getters.getSystemAccounts?.data ?? []
    },
    premiumsAccount() {
      return this.systemAccounts.find(
        (acc) => acc.ncan === PREMIUM_ACCOUNT_NCAN
      )
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    bsStore.actions.fetchSystemAccounts()
  },
  methods: {
    amountInEuro(amountInCredits) {
      return creditAmountInEuro(amountInCredits, this.exchangeRate)
    },
    validate() {
      return this.$refs.form.validate()
    },
    removeCredits() {
      // Not really necessary
      if (!this.validate()) {
        return
      }
      const withdrawal = {
        description: this.description,
        amountCredits: this.creditAmount,
        accountId: this.premiumsAccount.id,
      }
      bsStore.actions.withdrawCredits(withdrawal).then((location) => {
        if (location) {
          this.$router.push({
            name: 'premiumCreditsPage',
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
