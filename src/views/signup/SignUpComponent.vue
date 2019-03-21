<template>
  <div>
    <div class="container">
      <div class="mt-4 mb-4">
        <progress-registration-bar :current-selected="3" />
      </div>

      <div class="col-md-12">
        <div class="container box-widget background-primary mt-3">
          <div class="divProfileImage">
            <img src="../../assets/profile_img.png" />
          </div>
          <user-form />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressRegistrationBar from './ProgressRegistrationBar.vue'
import UserForm from './UserForm.vue'

export default {
  name: 'SignUpComponent',
  components: {
    ProgressRegistrationBar,
    UserForm,
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
