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

export default {
  components: {
    NewAccountCard,
    HomeTownCard,
    UserTypeCard,
  },
  data: function() {
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
      },
    }
  },
  watch: {
    step: function() {
      if (this.step < 0) {
        this.$router.push('/')
      }
      if (this.step == 3) {
        this.submitForm()
      }
    },
  },
  methods: {
    submitForm: function() {
      console.log(this.registrationRequest)
    },
  },
}
</script>

<style lang="scss"></style>
