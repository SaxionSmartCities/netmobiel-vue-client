<template>
  <div id="form">
    <div>
      <div class="border-bottom mb-2">flexibiliteit en bagage:</div>
      <form>
        <div class="form-group row">
          <div class="col-7">
            <label class="col-form-label" for="maxloopafstand"
              >Max. loopafstand:
            </label>
          </div>
          <div class="col">
            <input
              id="maxloopafstand"
              type="number"
              class="form-control"
              :placeholder="maxWalkDistance"
              @input="setMaxWalkDistance"
            />
          </div>
        </div>
        <div class="form-group row">
          <div class="col-7">
            <label class="col-form-label" for="flexibiliteit"
              >Flexibiliteit:
            </label>
          </div>
          <div class="col">
            <input
              id="flexibiliteit"
              type="number"
              class="form-control"
              :placeholder="flexibility"
              @input="setFlexibility"
            />
          </div>
        </div>
        <div>
          <div class="border-bottom mb-3">Ik reis en neem meestal mee:</div>
        </div>
        <div class="form-group row">
          <div class="col-4 text-center">
            <toggle-button
              icon="fas fa-shopping-bag	"
              name="baggage"
              @toggle="setBaggage"
            ></toggle-button>
          </div>
          <div class="col-4 text-center">
            <toggle-button
              icon="fas fa-wheelchair"
              name="wheelChair"
              @toggle="setWheelChair"
            ></toggle-button>
          </div>
          <div class="col-4 text-center">
            <toggle-button
              icon="fas fas fa-dog"
              name="animal"
              @toggle="setAnimal"
            ></toggle-button>
          </div>
        </div>
        <button class="btn btn-block btn-secondary" @click="submitForm($event)">
          Volgende stap
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import ToggleButton from '../common/ToggleButton'

export default {
  name: 'RegistrationStepThree',
  components: { ToggleButton },
  data: function() {
    return {
      maxWalkDistance: 10,
      flexibility: 10,
      rideBaggage: {
        baggage: false,
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
    setMaxWalkDistance(event) {
      this.maxWalkDistance = event.target.value
    },
    setFlexibility(event) {
      this.flexibility = event.target.value
    },
    setBaggage() {
      this.rideBaggage.baggage = !this.rideBaggage.baggage
    },
    setWheelChair() {
      this.rideBaggage.wheelChair = !this.rideBaggage.wheelChair
    },
    setAnimal() {
      this.rideBaggage.animal = !this.rideBaggage.animal
    },
  },
}
</script>

<style scoped></style>
