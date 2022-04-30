<template>
  <v-form ref="form" v-model="valid" lazy-validation class="full-height">
    <content-pane>
      <v-row dense>
        <v-col><h1>Systeeminstellingen</h1></v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <div
            class="text-uppercase caption font-weight-bold text-color-primary"
          >
            Financiële gegevens uitbetalingen
          </div>
          <div class="caption">
            Voor uitbetalingen aan deelnemers is een centrale bankrekening
            nodig. Dit is de rekening van waaruit deelnemers worden uitbetaald.
          </div>
          <v-row class="pt-2">
            <v-col>
              <v-text-field
                v-model.trim="treasurerAccount.iban"
                class="bg-white"
                label="Centrale IBAN rekening"
                :rules="[rules.required, rules.iban]"
                validate-on-blur
                outlined
                dense
                hide-details="auto"
                spellcheck="false"
                @change="
                  treasurerAccount.iban = formatIBAN(treasurerAccount.iban)
                "
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model.trim="treasurerAccount.ibanHolder"
                class="bg-white"
                label="Naam rekeninghouder"
                :rules="[rules.required]"
                validate-on-blur
                outlined
                dense
                hide-details="auto"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col xs6 class="mx-2">
          <v-btn block rounded outlined color="primary" @click="onCancel()">
            Annuleren
          </v-btn>
        </v-col>
        <v-col xs6 class="mx-2">
          <!-- Decision: Always enabling button to prevent a disabled button with a (visible) valid form. -->
          <!-- Example: IBAN is validated only after blur (to prevent errors during typing). -->
          <!--          Only after moving to the next field the field is validated and the save button -->
          <!--          would get enabled. -->
          <v-btn block rounded depressed color="button" @click="onSave()">
            Opslaan
          </v-btn>
        </v-col>
      </v-row>
    </content-pane>
  </v-form>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import * as uiStore from '@/store/ui'
import * as ibantools from 'ibantools'
import * as bsStore from '@/store/banker-service'

const BANKING_RESERVE_NCAN = 'banking-reserve'

export default {
  name: 'SystemSettingsPage',
  components: { ContentPane },
  data() {
    return {
      treasurerAccount: {
        iban: undefined,
        ibanHolder: undefined,
      },
      valid: false,
      rules: {
        required: (value) => !!value || 'Veld is verplicht',
        iban: (value) =>
          this.isValidIBAN(value) || 'Ongeldig IBAN rekeningnummer',
      },
    }
  },
  computed: {
    bankerUser() {
      return bsStore.getters.getBankerUser
    },
    systemAccounts() {
      return bsStore.getters.getSystemAccounts
    },
  },
  watch: {
    systemAccounts() {
      const treasurerAccount = this.lookupSystemAccount(BANKING_RESERVE_NCAN)
      if (treasurerAccount) {
        this.treasurerAccount.iban = this.formatIBAN(treasurerAccount.iban)
        this.treasurerAccount.ibanHolder = treasurerAccount.ibanHolder
      }
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    bsStore.actions.fetchSystemAccounts()
    // Fetch me from the banker service
    bsStore.actions.fetchBankerUser()
  },
  methods: {
    lookupSystemAccount(ncan) {
      return this.systemAccounts.data.find((acc) => acc.ncan === ncan)
    },
    validate() {
      return this.$refs.form.validate()
    },
    onCancel() {
      this.$router.go(-1)
    },
    onSave() {
      if (!this.validate()) {
        return
      }
      const bankingAcc = {
        ...this.lookupSystemAccount(BANKING_RESERVE_NCAN),
        ...this.treasurerAccount,
      }
      const updateTreasurerAccountPromise =
        bsStore.actions.updateAccount(bankingAcc)
      Promise.all([updateTreasurerAccountPromise]).then((results) => {
        if (!results.includes(false)) {
          this.$router.push({
            name: 'community',
          })
        }
      })
    },
    isValidIBAN(input) {
      if (!input) {
        // No IBAN is also a valid IBAN
        return true
      }
      const iban = ibantools.electronicFormatIBAN(input)
      return ibantools.isValidIBAN(iban)
    },
    formatIBAN(input) {
      return input ? ibantools.friendlyFormatIBAN(input.trim()) : null
    },
  },
}
</script>

<style lang="scss" scoped></style>
