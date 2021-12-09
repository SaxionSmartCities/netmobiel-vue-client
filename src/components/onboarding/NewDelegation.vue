<template>
  <v-row no-gutters>
    <v-col dense>
      <v-row>
        <v-col>
          <v-text-field
            v-model="user.firstName"
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
            v-model="user.lastName"
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
            v-model="user.phoneNumber"
            required
            hide-details
            outlined
            label="Mobiel nummer"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="user.email"
            required
            hide-details
            outlined
            label="E-mail"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters align="center">
        <v-col cols="1">
          <v-checkbox v-model="consent.acceptedTerms"></v-checkbox>
        </v-col>
        <v-col cols="11">
          Ik ga akkoord met de <a to="/">voorwaarden</a>, deelname aan het
          <a to="/">onderzoek</a> en het <a to="/">privacystatement</a>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col text-xs-center>
          <v-alert
            v-if="showConsentError"
            :value="true"
            type="error"
            color="red"
          >
            U moet akkoord gaan met de voorwaarden om verder te gaan.
          </v-alert>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'NewDelegation',
  props: {
    value: {
      type: Object,
      default: () => undefined,
    },
  },
  data: function () {
    return {
      user: this.value.user,
      consent: this.value.consent,
      enableConsentCheck: false,
      showSubmitButton: true,
    }
  },
  computed: {
    showConsentError() {
      return (
        (!this.consent.acceptedTerms || !this.consent.olderThanSixteen) &&
        this.enableConsentCheck
      )
    },
  },
}
</script>

<style scoped lang="scss"></style>
