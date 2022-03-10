<template>
  <v-container fluid fill-height class="background-primary overflow-auto">
    <v-row align="center" justify="center">
      <v-col>
        <v-row>
          <v-col v-if="step === 0">
            <new-account-card
              v-model="profile.consent"
              @prev-step="step--"
              @next-step="step++"
              @cancel="onCancel()"
              @update-consent="onUpdateConsent"
            />
          </v-col>
          <v-col v-if="step === 1">
            <new-account-terms
              v-model="profile.consent"
              @prev-step="step--"
              @next-step="step++"
              @update-consent="onUpdateConsent"
            />
          </v-col>
          <v-col v-if="step === 2">
            <home-town-card
              v-model="profile.address"
              @prev-step="step--"
              @next-step="step++"
              @update-address="onUpdateAddress"
            />
          </v-col>
          <v-col v-if="step === 3">
            <user-type-card
              v-model="profile.userRole"
              @prev-step="step--"
              @next-step="step++"
              @update-role="onUpdateRole"
            />
          </v-col>
        </v-row>
        <v-card v-if="step === 4" class="rounded-border">
          <v-card-title class="justify-center"
            >Afronden registratie</v-card-title
          >
          <v-card-text>
            <v-row no-gutters>
              <v-alert :value="status === 200" type="success">
                <p>Profiel aangemaakt!</p>
                <p>We sturen je over enkele seconden naar het beginscherm.</p>
              </v-alert>
              <v-alert :value="status === 409" type="warning">
                <p>Profiel bestaat al!</p>
                <p>We sturen je over enkele seconden naar het beginscherm.</p>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NewAccountTerms from '@/components/onboarding/NewAccountTerms.vue'
import NewAccountCard from '@/components/onboarding/NewAccountCard.vue'
import HomeTownCard from '@/components/onboarding/HomeTownCard.vue'
import UserTypeCard from '@/components/onboarding/UserTypeCard.vue'
import * as psStore from '@/store/profile-service'
import * as uiStore from '@/store/ui'

// The delay after creation to show the success message
const DELAY_AFTER_CREATION = 7000

export default {
  components: {
    NewAccountTerms,
    NewAccountCard,
    HomeTownCard,
    UserTypeCard,
  },
  data: function () {
    return {
      dryRun: false,
      step: 0,
      status: 0,
      // Profile with only those fields that are collected in the registration
      profile: {
        address: {},
        userRole: '',
        consent: {
          olderThanSixteen: false,
          acceptedTerms: false,
          safetyGuidelines: false,
        },
      },
    }
  },
  computed: {
    user() {
      return psStore.getters.getUser
    },
  },
  watch: {
    step: function () {
      if (this.step < 0) {
        this.$router.push('/')
      }
      if (this.step === 4) {
        this.submitForm()
      }
    },
  },
  beforeCreate() {
    // The registration page should not offer other options
    uiStore.mutations.disableFooter()
    // YbugHelper.show()
  },
  methods: {
    gotoLandingPage() {
      setTimeout(() => {
        this.$router.push({ name: 'landing' })
      }, DELAY_AFTER_CREATION)
    },
    onCancel() {
      // Got to the logout page, logout from keycloak is handled over there
      this.$router.push({ name: 'logout' })
    },
    onUpdateConsent(consent) {
      this.profile.consent = { ...consent }
    },
    onUpdateAddress(address) {
      // Address is a nested object, assure no ties with other objects.
      this.profile.address = JSON.parse(JSON.stringify(address))
    },
    onUpdateRole(role) {
      this.profile.userRole = role
    },
    submitForm: function () {
      if (this.dryRun) {
        // eslint-disable-next-line
        console.log(JSON.stringify(this.profile))
        this.gotoLandingPage()
      } else {
        this.profile.id = this.user.managedIdentity
        this.profile.firstName = this.user.givenName
        this.profile.lastName = this.user.familyName
        this.profile.email = this.user.email
        psStore.actions
          .createProfile(this.profile)
          .then(() => {
            this.status = 200
            this.gotoLandingPage()
          })
          .catch((status) => {
            if (status === 409 /* Conflict */) {
              this.status = 409
              // Meaning: Profile does already exist. Continue to the landing page
              // eslint-disable-next-line no-unused-vars
              psStore.actions.fetchProfile().catch((status) => {})
              this.gotoLandingPage()
            } else {
              // What can we do?
            }
          })
      }
    },
  },
}
</script>

<style lang="scss"></style>
