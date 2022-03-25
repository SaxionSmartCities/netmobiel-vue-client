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
          <v-alert type="warning">
            In de huidige testfase van de Netmobiel-app kun je nog niet écht
            credits opnemen. Het proces dat je straks doorloopt is identiek,
            echter de 'pennningmeester' laat de credits gewoon verdwijnen.
          </v-alert>
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
        <v-col> Van welke rekening wil je credits opnemen? </v-col>
        <v-col class="">
          <v-radio-group
            ref="accountField"
            v-model="account"
            :rules="[rules.ibanPresent]"
          >
            <v-radio label="Persoonlijk" value="personal" />
            <v-radio label="Premierekening" :value="premiumAccountNcan" />
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row v-if="checkIbanPresent(account) === true" dense>
        <v-col class="text-body-2"
          >{{ friendlyIBAN }} t.n.v. {{ effectiveAccount.ibanHolder }}
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
            hide-details="auto"
          ></v-textarea>
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
import * as psStore from '@/store/profile-service'
import * as ibantools from 'ibantools'

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
      account: 'personal',
      description: 'Omwisselen van Netmobiel credits',
      rules: {
        required: (value) => !!value || 'Veld is verplicht',
        minAmount: (value) => value >= MIN_AMOUNT || `Minimaal ${MIN_AMOUNT}`,
        maxAmount: (value) => value <= MAX_AMOUNT || `Maximaal ${MAX_AMOUNT}`,
        ibanPresent: (v) => this.checkIbanPresent(v),
      },
    }
  },
  computed: {
    bankerUser() {
      return bsStore.getters.getBankerUser
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
    exchangeRate() {
      return bsStore.getters.getBankerSettings?.exchangeRate ?? 0
    },
    effectiveAccount() {
      let account
      if (this.account === this.premiumAccountNcan) {
        account = this.premiumAccount
      } else if (this.account === 'personal') {
        account = this.bankerUser?.personalAccount
      }
      return account
    },
    friendlyIBAN() {
      return ibantools.friendlyFormatIBAN(this.effectiveAccount.iban)
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    // Fetch me from the banker service
    bsStore.actions.fetchBankerUser()
    if (this.canActAsTreasurer) {
      bsStore.actions.fetchSystemAccounts()
    }
  },
  methods: {
    validate() {
      return this.$refs.form.validate()
    },
    createWithdrawalRequest() {
      if (!this.validate()) {
        return
      }
      const wr = {
        description: this.description,
        amountCredits: this.creditAmount,
      }
      if (this.account === this.premiumAccountNcan) {
        // Withdraw from the system premium account, use the privileged call.
        wr.accountId = this.premiumAccount.id
        bsStore.actions.withdrawCredits(wr).then(this.routeToOverviewOnSuccess)
      } else {
        // Credits go to the user's personal account
        bsStore.actions
          .withdrawCreditsFromMyAccount(wr)
          .then(this.routeToOverviewOnSuccess)
      }
    },
    checkIbanPresent(v) {
      let account
      if (v === this.premiumAccountNcan) {
        account = this.premiumAccount
      } else if (v === 'personal') {
        account = this.bankerUser?.personalAccount
      }
      if (!account) {
        // Temporary issue, don't flash error message
        return false
      }
      return !account.iban
        ? 'Voeg IBAN rekening toe'
        : !account.ibanHolder
        ? 'Voeg naam rekeninghouder toe'
        : true
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
