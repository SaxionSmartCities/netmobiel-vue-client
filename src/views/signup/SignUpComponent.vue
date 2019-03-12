<template>
  <div>
    <div class="container">
      <div class="mt-4 mb-4">
        <progress-registration-bar :current-selected="3"/>
      </div>

      <div class="col-md-12">
        <user-form/>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressRegistrationBar from "./ProgressRegistrationBar.vue";
import UserForm from "./UserForm.vue";

export default {
  name: "SignUpComponent",
  components: {
    ProgressRegistrationBar,
    UserForm
  }
};
</script>

<style lang="scss">
</style>

