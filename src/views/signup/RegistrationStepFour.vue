<template>
  <form>
    <div class="text-center">
      <h6>Dag Laura Jansen!</h6>
      <small>Met welke vervoermiddelen wilt u reizen</small>
    </div>
    <p></p>
    <div class="border-bottom">
      <h6 class="text-center">
        Uw reisvoorkeuren
      </h6>
    </div>
    <div class="row">
      <div class="col text-center">
        <toggle-button
          icon="fas fa-car"
          name="Meerijden"
          @toggle="setRideAlong"
        ></toggle-button>
      </div>
      <div class="col text-center">
        <toggle-button
          class="col"
          icon="fas fa-taxi"
          name="Regiotaxi"
          @toggle="setRegionTaxi"
        ></toggle-button>
      </div>
      <div class="col text-center">
        <toggle-button
          id="togglebtnBus"
          class="col"
          icon="fas fa-bus"
          name="Bus"
          @toggle="setBus"
        ></toggle-button>
      </div>
    </div>
    <div class="row">
      <div class="col text-center">
        <toggle-button
          icon="fas fa-car"
          name="DeelAuto"
          @toggle="setShareCar"
        ></toggle-button>
      </div>
      <div class="col text-center">
        <toggle-button
          class="col"
          icon="fas fa-bicycle"
          name="Deelfiets"
          @toggle="setShareBike"
        ></toggle-button>
      </div>
      <div class="col text-center">
        <toggle-button
          class="col"
          icon="fas fa-train"
          name="trein"
          @toggle="setTrain"
        ></toggle-button>
      </div>
    </div>
    <button class="btn btn-block btn-secondary" @click="submitForm($event)">
      Volgende stap
    </button>
  </form>
</template>

<script>
import ToggleButton from '../common/ToggleButton'

export default {
  name: 'RegistrationStepFour',
  components: { ToggleButton },
  data: function() {
    return {
      conveyancePreferences: {
        rideAlong: false,
        regionTaxi: false,
        bus: false,
        shareCar: false,
        shareBike: false,
        train: false,
      },
    }
  },
  methods: {
    submitForm: function(event) {
      event.preventDefault()
      this.$store.commit('saveUserStep4', this.$data)
      this.$router.push('/home')
      console.log(this.$store.state.user)
      console.log(this.$data)
      //ugly
      this.$store.commit('incrementRegistrationStep', -3)
    },
    setRideAlong() {
      this.conveyancePreferences.rideAlong = !this.conveyancePreferences.rideAlong
    },
    setRegionTaxi() {
      this.conveyancePreferences.regionTaxi = !this.conveyancePreferences.regionTaxi
    },
    setBus() {
      this.conveyancePreferences.bus = !this.conveyancePreferences.bus
    },
    setShareCar() {
      this.conveyancePreferences.shareCar = !this.conveyancePreferences.shareCar
    },
    setShareBike() {
      this.conveyancePreferences.shareBike = !this.conveyancePreferences.shareBike
    },
    setTrain() {
      this.conveyancePreferences.train = !this.conveyancePreferences.train
    },
  },
}
</script>

<style lang="scss">
h6 {
  color: $color-secondary;
}
</style>
