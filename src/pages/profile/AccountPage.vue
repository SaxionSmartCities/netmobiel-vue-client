<template>
  <v-form ref="form" v-model="valid" class="full-height">
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
                v-model="user.firstName"
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
                v-model="user.lastName"
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
                start-with-year="true"
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
                v-model="user.email"
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
                v-model="user.phoneNumber"
                hide-details="true"
                outlined
                label="Telefoonnummer"
                validate-on-blur
                :rules="[rules.phone]"
              ></v-text-field>
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

export default {
  name: 'AccountPage',
  components: { SearchLocation, DateMenuSelector, ContentPane },
  data() {
    return {
      user: {
        address: {},
      },
      selectedProperty: null,
      valid: false,
      rules: {
        required: (value) => !!value || 'Veld is verplicht',
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
      },
    }
  },
  created() {
    uiStore.mutations.showBackButton()
  },
  mounted() {
    // Shallow copy
    this.user = { ...psStore.getters.getProfile }
    if (this.user?.address) {
      // Deep copy of address
      this.user.address = JSON.parse(JSON.stringify(this.user.address))
    }
  },
  methods: {
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
      psStore.actions
        .updateProfile(this.user)
        .then(() => this.$router.push({ name: 'profile' }))
    },
  },
}
</script>

<style lang="scss" scoped></style>
