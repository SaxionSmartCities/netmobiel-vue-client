<template>
  <v-card class="rounded-border">
    <v-card-title>Maak een account aan</v-card-title>
    <v-card-text class="py-0">
      <v-row vertical-align-center>
        <v-col>
          <v-text-field
            v-model="registrationRequest.firstName"
            required
            hide-details
            outlined
            label="Voornaam"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="registrationRequest.lastName"
            required
            hide-details
            outlined
            label="Achternaam"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="registrationRequest.email"
            required
            hide-details
            outlined
            label="E-mail"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters align="center">
        <v-col cols="1">
          <v-checkbox v-model="agreedAll"></v-checkbox>
        </v-col>
        <v-col cols="11">
          Ik ga akkoord met de <a to="/">voorwaarden</a>, deelname aan het
          <a to="/">onderzoek</a> en het <a to="/">privacystatement</a>
        </v-col>
      </v-row>
      <v-row no-gutters align="center">
        <v-col cols="1">
          <v-checkbox v-model="ageCheck"></v-checkbox>
        </v-col>
        <v-col cols="11">
          Ik ben 16 of ouder.
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col text-xs-center>
          <v-alert
            v-if="getRegistrationStatus.success === false"
            :value="true"
            type="error"
            color="red"
          >
            {{ getRegistrationStatus.message }}
          </v-alert>
          <v-alert
            v-if="acceptError.success === false"
            :value="true"
            type="error"
            color="red"
          >
            {{ acceptError.message }}
          </v-alert>
          <v-alert
            v-if="getRegistrationStatus.success === true"
            :value="true"
            type="success"
            color="green"
          >
            Profiel aangemaakt! <br />
            We sturen u terug naar het login-scherm.
          </v-alert>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-row no-gutters>
        <v-col xs6 class="mx-2">
          <v-btn block rounded color="button" @click="submitForm()"
            >Account aanmaken</v-btn
          >
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import { setTimeout } from 'timers'
export default {
  name: 'NewAccountCard',
  data: function() {
    return {
      waiting: null,
      registrationRequest: {
        firstName: '',
        lastName: '',
        email: '',
      },
      agreedAll: false,
      ageCheck: false,
      acceptError: {
        success: undefined,
        message: '',
      },
      showSubmitButton: true,
    }
  },
  computed: {
    getRegistrationStatus() {
      return this.$store.getters['rs/getRegistrationStatus']
    },
  },
  watch: {
    getRegistrationStatus(newValue) {
      if (newValue.success === true) {
        this.showSubmitButton = false

        this.waiting = setTimeout(() => {
          this.$store.commit('rs/clearRegistrationRequest')
          this.$emit('next-step')
        }, 2500)
      }
    },
  },
  beforeCreate() {
    this.$store.commit('ui/disableFooter')
  },
  methods: {
    submitForm: function() {
      if (this.agreedAll && this.ageCheck) {
        this.$store.dispatch(
          'rs/submitRegistrationRequest',
          this.registrationRequest
        )
      } else {
        this.acceptError.success = false
        this.acceptError.message =
          'U moet zowel akkoord gaan met de voorwaarden alsmede 16 jaar of ouder zijn.'
      }
    },
  },
}
</script>

<style scoped lang="scss"></style>
