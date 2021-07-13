<template>
  <content-pane>
    <v-row>
      <v-col class="pt-0">
        <v-row align="end">
          <v-col>
            <h3>{{ titles[currStep - 1] }}</h3>
          </v-col>
          <v-col class="shrink stappen caption text--gray"
            >Stap {{ currStep }} / {{ maxSteps }}
          </v-col>
        </v-row>
        <v-row>
          <v-col v-if="currStep === 1" class="pt-0">
            <new-delegation
              v-model="registrationRequest"
              @onFormValid="currentFormValid"
            />
          </v-col>
          <v-col v-if="currStep === 2">
            <delegation-options v-model="registrationRequest" />
          </v-col>
          <v-col v-if="currStep === 3">
            <delegation-comms-settings v-model="registrationRequest" />
          </v-col>
          <v-col v-if="currStep === 4">
            <new-delegation-image v-model="registrationRequest" />
          </v-col>
        </v-row>
        <v-row>
          <v-col xs6>
            <v-btn
              block
              rounded
              outlined
              color="primary"
              :disabled="currStep === 1"
              @click="prevStep()"
            >
              Terug
            </v-btn>
          </v-col>
          <v-col v-if="currStep !== maxSteps" xs6>
            <v-btn
              block
              rounded
              depressed
              color="button"
              :disabled="!nextStepEnabled"
              @click="nextStep()"
            >
              Verder
            </v-btn>
          </v-col>
          <v-col v-else xs6>
            <v-btn block rounded depressed color="button" @click="complete()">
              Aanmaken
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane'
import NewDelegation from '@/components/onboarding/NewDelegation'
import DelegationOptions from '@/components/onboarding/NewDelegatorOptions'
import DelegationCommsSettings from '@/components/onboarding/DelegationCommsSettings'
import NewDelegationImage from '@/components/onboarding/NewDelegatorImage'
import * as uiStore from '@/store/ui'

export default {
  name: 'DelegationOverview',
  components: {
    ContentPane,
    NewDelegation,
    DelegationOptions,
    DelegationCommsSettings,
    NewDelegationImage,
  },
  data() {
    return {
      currStep: 1,
      maxSteps: 4,
      nextStepEnabled: false,
      titles: [
        'Nieuw account',
        'Ritvoorkeuren',
        'Communicatie',
        'Profiel foto',
      ],
      registrationRequest: {
        extraTransferTime: false,
        consent: {
          olderThanSixteen: true,
        },
      },
    }
  },
  mounted() {
    uiStore.mutations.showBackButton()
  },
  methods: {
    nextStep() {
      this.currStep++
    },
    prevStep() {
      this.currStep--
    },
    complete() {
      console.log(`TODO: onComplete ${this.registrationRequest}`)
    },
    currentFormValid(isValid) {
      this.nextStepEnabled = isValid
    },
  },
}
</script>
<style lang="scss">
.options {
  border: 1px solid gray;
  border-radius: 10px;
  padding-bottom: 0;
  padding-top: 0;

  span {
    // TODO: Find out what class defines the for the expansion panel.
    font-size: 15px;
  }
}

.switch-overwrite {
  margin-top: 0;
}
</style>
