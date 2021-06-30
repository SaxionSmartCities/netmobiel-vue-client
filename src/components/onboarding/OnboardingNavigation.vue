<template>
  <v-row>
    <v-col class="pt-0">
      <v-row align="end">
        <v-col>
          <h3>{{ title }}</h3>
        </v-col>
        <v-col class="shrink stappen caption text--gray"
          >Stap {{ currStep }} / {{ maxSteps }}
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="currStep === 1" class="pt-0">
          <new-delegation v-model="registrationRequest" />
        </v-col>
        <v-col v-if="currStep === 2">
          <delegation-options v-model="registrationRequest" />
        </v-col>
        <v-col v-if="currStep === 3">
          <delegation-comms-settings v-model="registrationRequest" />
        </v-col>
      </v-row>
      <v-row>
        <v-col xs6>
          <v-btn block rounded outlined color="primary" @click="prevStep()">
            Terug
          </v-btn>
        </v-col>
        <v-col xs6>
          <v-btn block rounded depressed color="button" @click="nextStep()">
            Verder
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import NewDelegation from '@/components/onboarding/NewDelegation'
import DelegationOptions from '@/components/onboarding/NewDelegatorOptions'
import DelegationCommsSettings from '@/components/onboarding/DelegationCommsSettings'

export default {
  name: 'OnboardingNavigation',
  components: {
    NewDelegation,
    DelegationOptions,
    DelegationCommsSettings,
  },
  props: {
    title: { type: String, required: true, default: '' },
  },
  data() {
    return {
      maxSteps: 4,
      currStep: 1,
      registrationRequest: {
        extraTransferTime: false,
        consent: {},
      },
    }
  },
  methods: {
    nextStep() {
      this.currStep++
    },
    prevStep: function() {
      this.currStep--
    },
  },
}
</script>

<style lang="scss">
.stappen {
  min-width: 100px;
}
</style>
