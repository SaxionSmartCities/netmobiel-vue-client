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
      <v-layout mt-5>
        <v-flex text-xs-center>
          <v-btn class="full-width" @click="submitForm($event)"
            >Maak een account aan!</v-btn
          >
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
export default {
  name: 'RegistrationScreen',
  data: function() {
    return {
      registrationRequest: {
        firstName: '',
        lastName: '',
        email: '',
      },
    }
  },
  beforeCreate() {
    this.$store.commit('disableFooter')
  },
  beforeDestroy() {
    this.$store.commit('enableFooter')
  },
  methods: {
    submitForm: function(event) {
      event.preventDefault()

      console.log('submitting form')
      console.log(this.registrationRequest)

      this.$store.dispatch(
        'submitRegistrationRequest',
        this.registrationRequest
      )
    },
  },
}
</script>

<style scoped lang="scss"></style>
