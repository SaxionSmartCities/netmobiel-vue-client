<template>
  <v-container fluid fill-height class="background-primary">
    <v-row align="center" justify="center" class="pa-4">
      <v-col>
        <v-row>
          <v-col v-if="step === 0">
            <new-account-card
              v-model="registrationRequest"
              @prev-step="step--"
              @next-step="step++"
            />
          </v-col>
          <v-col v-if="step === 1">
            <home-town-card
              v-model="registrationRequest"
              @prev-step="step--"
              @next-step="step++"
            />
          </v-col>
          <v-col v-if="step === 2">
            <user-type-card
              v-model="registrationRequest"
              @prev-step="step--"
              @next-step="step++"
            />
          </v-col>
        </v-row>
        <v-card v-if="step == 3" class="rounded-border">
          <v-card-title class="justify-center">Aanmaken account</v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-alert
                v-if="getRegistrationStatus.success === true"
                :value="true"
                type="success"
                color="green"
              >
                Profiel aangemaakt!
                <br />
                U ontvangt een e-mail waarmee U de registratie kunt voltooien.
                Controleer de spamfolder als de e-mail niet verschijnt in de
                inbox!
                <br />
                We sturen U over enkele seconden terug naar het login-scherm.
              </v-alert>
              <v-alert
                v-if="getRegistrationStatus.success === false"
                :value="true"
                type="error"
                color="red"
              >
                {{ getRegistrationStatus.message }}
              </v-alert>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-row no-gutters class="mb-2">
              <v-col xs6 class="mx-2">
                <v-btn block text @click="step--">
                  <v-icon>arrow_back</v-icon>
                  Terug
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
        <v-row justify="center">
          <v-col class="text-center">
            <v-btn to="/howTo" depressed color="primary">
              <span class="text-light-grey underlined">
                Hulp bij Netmobiel
              </span>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NewAccountCard from '@/components/onboarding/NewAccountCard.vue'
import HomeTownCard from '@/components/onboarding/HomeTownCard.vue'
import UserTypeCard from '@/components/onboarding/UserTypeCard.vue'
import { setTimeout } from 'timers'
import * as rsStore from '@/store/registration-service'

export default {
  components: {
    NewAccountCard,
    HomeTownCard,
    UserTypeCard,
  },
  data() {
    return {
      step: 0,
      registrationRequest: {
        firstName: '',
        lastName: '',
        email: '',
        address: {
          locality: '',
        },
        userRole: '',
        consent: {
          olderThanSixteen: false,
          acceptedTerms: false,
        },
      },
    }
  },
  computed: {
    getRegistrationStatus() {
      return rsStore.getters.getRegistrationStatus
    },
  },
  watch: {
    step() {
      if (this.step < 0) {
        this.$router.push('/')
      }
      if (this.step == 3) {
        this.submitForm()
      }
    },
    getRegistrationStatus(newValue) {
      if (newValue.success === true) {
        setTimeout(() => {
          rsStore.mutations.clearRegistrationRequest()
          this.$router.push('/')
        }, 7000)
      }
    },
  },
  methods: {
    submitForm() {
      rsStore.actions.submitRegistrationRequest(this.registrationRequest)
    },
  },
}
</script>

<style lang="scss"></style>
