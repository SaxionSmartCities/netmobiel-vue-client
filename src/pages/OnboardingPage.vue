<template>
  <v-container fluid fill-height class="background-primary">
    <v-row align="center" justify="center" class="pa-4">
      <v-col>
        <v-row>
          <v-col v-if="step === 0">
            <age-card @prev-step="goBack()" @next-step="step++" />
          </v-col>
          <v-col v-if="step === 1">
            <interests-card @prev-step="step--" @next-step="step++" />
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
import AgeCard from '@/components/onboarding/AgeCard.vue'
import InterestsCard from '@/components/onboarding/InterestsCard.vue'

export default {
  components: {
    AgeCard,
    InterestsCard,
  },
  data: function() {
    return {
      step: 0,
    }
  },
  watch: {
    step: function() {
      if (this.step >= 2) {
        this.$router.push('/onboardingComplete')
      }
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="scss"></style>
