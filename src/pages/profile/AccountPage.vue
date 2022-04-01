<template>
  <v-form ref="form" v-model="valid" lazy-validation class="full-height">
    <content-pane>
      <v-row dense>
        <v-col><h1>Account</h1></v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <span
            class="text-uppercase caption font-weight-bold text-color-primary"
          >
            Persoonlijk
          </span>
          <v-row>
            <v-col>
              <v-text-field
                v-model.trim="user.firstName"
                hide-details="auto"
                validate-on-blur
                outlined
                label="Voornaam"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model.trim="user.lastName"
                hide-details="auto"
                validate-on-blur
                outlined
                label="Achternaam"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <date-menu-selector
                :value="user.dateOfBirth"
                label="Geboortedatum"
                :max="'today'"
                :outlined="true"
                :start-with-year="true"
                @date-selected="onDateSelected"
              ></date-menu-selector>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <span
            class="text-uppercase caption font-weight-bold text-color-primary"
          >
            Adres
          </span>
          <v-row>
            <v-col>
              <search-location
                :address="user.address"
                label="Woonadres"
                :outlined="true"
                field="home"
                :favorable="false"
                @search-completed="onSearchCompleted"
              ></search-location>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <span
            class="text-uppercase caption font-weight-bold text-color-primary"
          >
            Contactgegevens
          </span>
          <v-row>
            <v-col>
              <v-text-field
                v-model.trim="user.email"
                hide-details="auto"
                validate-on-blur
                outlined
                readonly
                hint="Emailadres kan niet gewijzigd worden"
                label="E-mailadres"
                :rules="[rules.required, rules.email]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model.trim="user.phoneNumber"
                hide-details="auto"
                outlined
                label="Telefoonnummer"
                validate-on-blur
                :rules="[rules.phone]"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <div
            class="text-uppercase caption font-weight-bold text-color-primary"
          >
            Financiële gegevens
          </div>
          <div class="caption">
            De financiële gegevens zijn alleen nodig bij opnames.
          </div>
          <v-row class="pt-2">
            <v-col>
              <v-text-field
                v-model.trim="personalAccount.iban"
                class="bg-white"
                label="IBAN rekening"
                :rules="[rules.iban]"
                validate-on-blur
                outlined
                dense
                hide-details="auto"
                spellcheck="false"
                @change="
                  personalAccount.iban = formatIBAN(personalAccount.iban)
                "
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model.trim="personalAccount.ibanHolder"
                class="bg-white"
                label="Naam rekeninghouder"
                :rules="[rules.requiredIfIban]"
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
import * as psStore from '@/store/profile-service'
import DateMenuSelector from '@/components/common/DateMenuSelector'
import SearchLocation from '@/components/search/SearchLocation'
import * as ibantools from 'ibantools'
import * as bsStore from '@/store/banker-service'

export default {
  name: 'AccountPage',
  components: { SearchLocation, DateMenuSelector, ContentPane },
  data() {
    return {
      user: {
        address: {},
      },
      personalAccount: {
        iban: undefined,
        ibanHolder: undefined,
      },
      selectedProperty: null,
      valid: false,
      rules: {
        required: (value) => !!value || 'Veld is verplicht',
        requiredIfIban: (value) =>
          !!value || !this.personalAccount.iban || 'Veld is verplicht',
        email: (value) =>
          !!value?.match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ) ||
          !value ||
          'Ongeldig email adres',
        phone: (value) =>
          !!value?.match(
            /(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)/
          ) ||
          !value ||
          'Ongeldig nummer',
        iban: (value) =>
          this.isValidIBAN(value) || 'Ongeldig IBAN rekeningnummer',
      },
    }
  },
  computed: {
    bankerUser() {
      return bsStore.getters.getBankerUser
    },
  },
  watch: {
    bankerUser() {
      this.personalAccount = JSON.parse(
        JSON.stringify(this.bankerUser.personalAccount)
      )
      if (this.personalAccount.iban) {
        this.personalAccount.iban = this.formatIBAN(this.personalAccount.iban)
      }
    },
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  mounted() {
    // Fetch me from the banker service
    bsStore.actions.fetchBankerUser()
    // Shallow copy
    this.user = { ...psStore.getters.getProfile }
    if (this.user?.address) {
      // Deep copy of address
      this.user.address = JSON.parse(JSON.stringify(this.user.address))
    }
  },
  methods: {
    validate() {
      return this.$refs.form.validate()
    },
    onDateSelected(date) {
      this.user.dateOfBirth = date
    },
    onSearchCompleted(place) {
      this.user.address = { ...place }
      // home address is not mandatory (?)
      // this.valid = this.user.address.location?.coordinates?.length === 2
    },
    onCancel() {
      this.$router.push({ name: 'profile' })
    },
    onSave() {
      if (!this.validate()) {
        return
      }
      this.personalAccount.name = `${this.user.firstName} ${this.user.lastName}`
      const updateAccountPromise = bsStore.actions.updatePersonalAccount(
        this.personalAccount
      )
      const updateProfilePromise = psStore.actions.updateProfile(this.user)
      Promise.all([updateProfilePromise, updateAccountPromise]).then(
        (results) => {
          // The profile update returns undefined
          if (!results.includes(false)) {
            this.$router.push({
              name: 'profile',
            })
          }
        }
      )
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
