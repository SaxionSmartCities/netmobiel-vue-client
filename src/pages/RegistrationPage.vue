<template>
  <v-container fluid fill-height class="background-primary">
    <v-row align="center" justify="center" class="pa-4">
      <v-col>
        <v-row>
          <v-col v-if="step === 0">
            <new-account-card @next-step="step++"
          /></v-col>
          <v-col v-if="step === 1">
            <home-town-card @next-step="step++" />
          </v-col>
          <v-col v-if="step === 2">
            <user-type-card @next-step="step++" />
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
    }
  },
  watch: {
    step: function() {
      if (this.step >= 3) {
        this.$router.push('/home')
      }
    },
  },
}
</script>

<style lang="scss"></style>
