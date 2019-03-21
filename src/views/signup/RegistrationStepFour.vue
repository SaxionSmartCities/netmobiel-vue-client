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
  name: 'RegistrationStepFour',
  data: function() {
    return {
      conveyancePreferences: {
        buggy: false,
        walkAppliance: false,
        wheelChair: false,
        animal: false,
      },
    }
  },
  methods: {
    submitForm: function(event) {
      event.preventDefault()
      this.$store.commit('saveUserStep4', this.$data)
      this.$router.push('/home')
      console.log(this.$store.state.user)
      //ugly
      this.$store.commit('incrementRegistrationStep', -3)
    },
  },
}
</script>

<style scoped></style>
