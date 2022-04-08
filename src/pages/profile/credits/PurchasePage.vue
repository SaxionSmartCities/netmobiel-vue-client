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
      <v-row dense class="align-center">
        <v-col> Hoeveel credits wil je inkopen? </v-col>
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
            min-width="9em"
            @click="startMoneyTransfer()"
          >
            Betalen
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
import { creditAmountInEuro } from '@/utils/Utils'

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
      description: 'Credits inkopen voor Netmobiel',
      creditAmount: MIN_AMOUNT,
      bankSimulated: config.BANK_SIMULATED || false,
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
  },
  created() {
    uiStore.mutations.showBackButton()
    bsStore.actions.fetchBankerSettings()
  },
  methods: {
    amountInEuro(amountInCredits) {
      return creditAmountInEuro(amountInCredits, this.exchangeRate)
    },
    startMoneyTransfer() {
      const deposit = {
        description: this.description,
        amountCredits: this.creditAmount,
        returnUrl: new URL('wait-for-deposit-confirmation', location.href),
      }
      // Credits go to the user's personal account
      bsStore.actions.depositCreditsToMyAccount(deposit).then((data) => {
        // follow payment URL in current window
        location = data.paymentUrl
      })
    },
  },
}
</script>
<style lang="scss"></style>
