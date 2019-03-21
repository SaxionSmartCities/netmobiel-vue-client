<template>
  <div id="form">
    <div>
      <form>
        <button class="btn btn-block btn-secondary" @click="submitForm($event)">
          Volgende stap
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegistrationStepTwo',
  data: function() {
    return {
      //may be split in an additional 3 values
      dateOfBirth: '',
      //
      biography: '',
    }
  },
  methods: {
    submitForm: function(event) {
      event.preventDefault()
      //logic to get the date from the text field
      this.$store.commit('saveUserStep2', this.$data)
      this.$store.commit('incrementRegistrationStep', 1)
    },
  },
}
</script>

<style scoped></style>
