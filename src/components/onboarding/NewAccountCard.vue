<template>
  <v-card class="rounded-border">
    <v-card-title>Maak een account aan</v-card-title>
    <v-card-text class="py-0">
      <v-row vertical-align-center>
        <v-col>
          <v-text-field
            v-model="value.firstName"
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
            v-model="value.lastName"
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
            v-model="value.email"
            required
            hide-details
            outlined
            label="E-mail"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters align="center">
        <v-col cols="1">
          <v-checkbox v-model="value.consent.acceptedTerms"></v-checkbox>
        </v-col>
        <v-col cols="11">
          Ik ga akkoord met de <a to="/">voorwaarden</a>, deelname aan het
          <a to="https://www.netmobiel.eu/">onderzoek</a> en het
          <a to="https://www.netmobiel.eu/privacyverklaring-app/"
            >privacystatement</a
          >
        </v-col>
      </v-row>
      <v-row no-gutters align="center">
        <v-col cols="1">
          <v-checkbox v-model="value.consent.olderThanSixteen"></v-checkbox>
        </v-col>
        <v-col cols="11">
          Ik ben 16 jaar of ouder.
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
            U moet zowel akkoord gaan met de voorwaarden alsmede 16 jaar of
            ouder zijn.
          </v-alert>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-row no-gutters class="mb-2">
        <v-col xs6 class="mx-2">
          <v-btn block text @click="back()">
            <v-icon>arrow_back</v-icon>
            Terug
          </v-btn>
        </v-col>
        <v-col xs6 class="mx-2">
          <v-btn block rounded color="button" @click="submitForm()">
            Verder
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as uiStore from '@/store/ui'

export default {
  name: 'NewAccountCard',
  props: {
    value: {
      type: Object,
      default: () => undefined,
    },
  },
  data: function() {
    return {
      enableConsentCheck: false,
      showSubmitButton: true,
    }
  },
  computed: {
    showConsentError() {
      return (
        (!this.value.consent.acceptedTerms ||
          !this.value.consent.olderThanSixteen) &&
        this.enableConsentCheck
      )
    },
  },
  beforeCreate() {
    uiStore.mutations.disableFooter()
  },
  methods: {
    submitForm: function() {
      // Only show consent error after the user has clicked on submit.
      this.enableConsentCheck = true
      if (
        this.value.consent.acceptedTerms &&
        this.value.consent.olderThanSixteen
      ) {
        this.$emit('next-step')
      }
    },
    back: function() {
      this.$emit('prev-step')
    },
  },
}
</script>

<style scoped lang="scss"></style>
