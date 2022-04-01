<template>
  <v-form ref="form" v-model="valid" class="full-height">
    <content-pane>
      <v-row dense>
        <v-col>
          <h1>Premiesaldo Verhogen</h1>
          <div class="caption">
            Door premie toe te voegen kun je beloningen uitbetalen aan de
            deelnemers. Hou een evenredige dekking aan op de bankrekening van je
            organisatie.
          </div>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col> Eén credit kost {{ exchangeRate }} eurocent. </v-col>
      </v-row>
      <v-row dense class="align-center">
        <v-col> Hoeveel premie wil je toevoegen? </v-col>
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
            color="button"
            :disabled="!valid"
            @click="addCredits()"
          >
            Verhogen
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
import { creditAmountInEuro } from '@/utils/Utils'

const MIN_AMOUNT = 1
const MAX_AMOUNT = 50000
const PREMIUM_ACCOUNT_NCAN = 'premiums'

export default {
  name: 'PremiumDepositPage',
  components: {
    ContentPane,
  },
  data: function () {
    return {
      valid: false,
      description: 'Ophogen saldo premieuitgifte',
      creditAmount: MIN_AMOUNT,
      rules: {
        required: (value) => !!value || 'Veld is verplicht',
        minAmount: (value) => value >= MIN_AMOUNT || `Minimaal ${MIN_AMOUNT}`,
        maxAmount: (value) => value <= MAX_AMOUNT || `Maximaal ${MAX_AMOUNT}`,
      },
    }
  },
  computed: {
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
    addCredits() {
      // Not really necessary
      if (!this.validate()) {
        return
      }
      const deposit = {
        description: this.description,
        amountCredits: this.creditAmount,
        accountId: this.premiumsAccount.id,
      }
      bsStore.actions.depositCredits(deposit).then((location) => {
        if (location) {
          this.$router.push({
            name: 'systemCreditsPage',
          })
        }
      })
    },
  },
}
</script>
<style lang="scss"></style>
