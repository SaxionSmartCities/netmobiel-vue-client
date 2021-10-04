<template>
  <v-card class="rounded-border">
    <v-card-title>Welkom bij Netmobiel!</v-card-title>
    <v-card-text class="py-0">
      <v-form ref="form" v-model="valid">
        <v-row>
          <v-col>
            Je registreert je met de volgende gegevens:
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col class="col-6 offset-1">
            {{ user.givenName }} {{ user.familyName }}
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col class="col-6 offset-1">
            {{ user.email }}
          </v-col>
        </v-row>
        <v-row no-gutters align="center">
          <v-col cols="1">
            <v-checkbox
              v-model="value.consent.safetyGuidelines"
              :rules="[rules.required]"
            ></v-checkbox>
          </v-col>
          <v-col cols="11">
            Bij het gebruik van de Netmobiel-app hou ik mij aan de geldende
            RIVM-richtlijnen.
          </v-col>
        </v-row>
        <v-row no-gutters align="center">
          <v-col cols="1">
            <v-checkbox
              v-model="value.consent.olderThanSixteen"
              :rules="[rules.required]"
            ></v-checkbox>
          </v-col>
          <v-col cols="11">
            Ik ben 16 jaar of ouder of heb toestemming van een ouder of voogd.
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col text-xs-center>
            <v-alert
              v-if="!valid && enableConsentCheck"
              :value="true"
              type="error"
              color="red"
            >
              Vul alle verplichte velden in en ga akkoord gaan met de
              voorwaarden om door te kunnen gaan.
            </v-alert>
          </v-col>
        </v-row>
      </v-form>
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
          <v-btn block rounded depressed color="button" @click="submitForm()">
            Verder
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as psStore from '@/store/profile-service'

export default {
  name: 'NewAccountCard',
  props: {
    value: {
      type: Object,
      default: () => undefined,
    },
  },
  data() {
    return {
      enableConsentCheck: false,
      showSubmitButton: true,
      valid: false,
      rules: {
        required: value => !!value || '',
        email: value =>
          !!value.match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ) || 'Ongeldig email adres',
      },
    }
  },
  computed: {
    user() {
      return psStore.getters.getUser
    },
  },
  methods: {
    submitForm() {
      // Only show consent error after the user has clicked on submit.
      this.enableConsentCheck = true
      this.validate()
      if (this.valid) {
        this.$emit('next-step')
      }
    },
    back() {
      this.$emit('prev-step')
    },
    validate() {
      this.$nextTick(() => {
        const isValid = this.$refs.form.validate()
        this.$emit('onFormValid', isValid)
      })
    },
  },
}
</script>

<style scoped lang="scss"></style>
