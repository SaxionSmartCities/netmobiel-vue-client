<template>
  <div>
    <div class="container">
      <div class="mt-4 mb-4">
        <progress-registration-bar :current-selected="registrationStep" />
      </div>

      <div class="col-md-12">
        <div class="container box-widget background-primary mt-3">
          <div class="divProfileImage">
            <img src="../../assets/profile_img.png" />
          </div>
          <user-form />
        </div>
        <div class="container box-widget background-primary mt-3">
          <registration-step-one v-show="registrationStep == 1" />
          <registration-step-two v-show="registrationStep == 2" />
          <registration-step-three v-show="registrationStep == 3" />
          <registration-step-four v-show="registrationStep == 4" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressRegistrationBar from './ProgressRegistrationBar.vue'
import RegistrationStepOne from './RegistrationStepOne.vue'
import RegistrationStepTwo from './RegistrationStepTwo'
import RegistrationStepThree from './RegistrationStepThree'
import RegistrationStepFour from './RegistrationStepFour'

export default {
  name: 'SignUpComponent',
  components: {
    RegistrationStepFour,
    RegistrationStepThree,
    RegistrationStepTwo,
    ProgressRegistrationBar,
    RegistrationStepOne,
  },
  computed: {
    registrationStep() {
      return this.$store.getters.getRegistrationStep
    },
  },
}
</script>

<style lang="scss">
img {
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  height: 25%;
  width: 25%;
}
.divProfileImage {
  display: flex;
  justify-content: center;
}
</style>
