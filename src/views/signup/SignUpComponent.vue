<template>
  <div>
    <div class="container">
      <div class="mt-4 mb-4">
        <progress-registration-bar :current-selected="registrationStep" />
      </div>

      <div id="test" class="col-md-12">
        <div class="container box-widget background-primary mt-3">
          <img src="../../assets/profile_img.png" alt="nophoto" />
          <user-profile-input v-show="registrationStep == 1" />
          <extra-profile-input v-show="registrationStep == 2" />
          <flexibility v-show="registrationStep == 3" />
          <travel-preferences v-show="registrationStep == 4" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressRegistrationBar from './ProgressRegistrationBar.vue'
import UserProfileInput from './UserProfileInput.vue'
import ExtraProfileInput from './ExtraProfileInput'
import Flexibility from './Flexibility'
import TravelPreferences from './TravelPreferences'

export default {
  name: 'SignUpComponent',
  components: {
    TravelPreferences,
    Flexibility,
    ExtraProfileInput,
    ProgressRegistrationBar,
    UserProfileInput,
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
  margin-top: -18%;
  margin-left: 38%;
  justify-content: center;
}
</style>
