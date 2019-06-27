<template>
  <v-form>
    <v-container grid-list-xs>
      <v-layout pa-3>
        <v-flex text-xs-center><h1>Maak een account aan</h1> </v-flex>
      </v-layout>
      <v-layout pa-1 vertical-align-center>
        <v-flex xs3>
          <div>Voornaam</div>
        </v-flex>
        <v-flex xs9>
          <v-text-field
            v-model="registrationRequest.firstName"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout pa-1 vertical-align-center>
        <v-flex xs3>
          <span>Achternaam <small>(inc. tussenvoegsels)</small></span>
        </v-flex>
        <v-flex xs9>
          <v-text-field
            v-model="registrationRequest.lastName"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout pa-1 vertical-align-center>
        <v-flex xs3>
          <span>E-mailadres</span>
        </v-flex>
        <v-flex xs9>
          <v-text-field
            v-model="registrationRequest.email"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex text-xs-center>
          <v-alert
            v-if="getRegistrationStatus.success === false"
            :value="true"
            type="error"
            color="red"
          >
            {{ getRegistrationStatus.message }}
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
        </v-flex>
      </v-layout>
      <v-layout v-if="showSubmitButton" mt-5>
        <v-flex text-xs-center>
          <v-btn class="full-width" @click="submitForm($event)">
            Maak een account aan!</v-btn
          >
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import { setTimeout } from 'timers'
export default {
  name: 'RegistrationScreen',
  data: function() {
    return {
      waiting: null,
      registrationRequest: {
        firstName: '',
        lastName: '',
        email: '',
      },
      showSubmitButton: true,
    }
  },
  computed: {
    getRegistrationStatus() {
      return this.$store.getters.getRegistrationStatus
    },
  },
  watch: {
    getRegistrationStatus(newValue) {
      if (newValue.success === true) {
        this.showSubmitButton = false

        this.waiting = setTimeout(() => {
          this.$store.commit('clearRegistrationRequest')
          this.$router.push('/')
        }, 2500)
      }
    },
  },
  beforeCreate() {
    this.$store.commit('disableFooter')
  },
  methods: {
    submitForm: function(event) {
      event.preventDefault()

      this.$store.dispatch(
        'submitRegistrationRequest',
        this.registrationRequest
      )
    },
  },
}
</script>

<style scoped lang="scss"></style>
