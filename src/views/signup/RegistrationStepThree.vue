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
  name: 'RegistrationStepThree',
  data: function() {
    return {
      maxWalkDistance: 10,
      flexibility: 10,
      rideBaggage: {
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
      this.$store.commit('saveUserStep3', this.$data)
      this.$store.commit('incrementRegistrationStep', 1)
    },
  },
}
</script>

<style scoped></style>
