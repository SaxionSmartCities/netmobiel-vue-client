<template>
  <form>
    <div class="text-center">
      <h6>Hoi {{ getUserName }}!</h6>
      <small>Met welke vervoermiddelen wilt u reizen</small>
    </div>
    <p></p>
    <div class="border-bottom">
      <h6 class="text-center">
        Uw reisvoorkeuren
      </h6>
    </div>
    <div class="row">
      <div class="col-4 text-center">
        <toggle-button
          icon="fas fa-car"
          name="Meerijden"
          :is-toggled-default-state="conveyancePreferences.rideAlong"
          @toggle="setRideAlong"
        ></toggle-button>
      </div>
      <div class="col-4 text-center">
        <toggle-button
          icon="fas fa-taxi"
          name="Regiotaxi"
          :is-toggled-default-state="conveyancePreferences.regionTaxi"
          @toggle="setRegionTaxi"
        ></toggle-button>
      </div>
      <div class="col-4 text-center">
        <toggle-button
          id="togglebtnBus"
          icon="fas fa-bus"
          name="Bus"
          :is-toggled-default-state="conveyancePreferences.bus"
          @toggle="setBus"
        ></toggle-button>
      </div>
    </div>
    <div class="row">
      <div class="col-4 text-center">
        <toggle-button
          icon="fas fa-car"
          name="DeelAuto"
          :is-toggled-default-state="conveyancePreferences.shareCar"
          @toggle="setShareCar"
        ></toggle-button>
      </div>
      <div class="col-4 text-center">
        <toggle-button
          icon="fas fa-bicycle"
          name="Deelfiets"
          :is-toggled-default-state="conveyancePreferences.shareBike"
          @toggle="setShareBike"
        ></toggle-button>
      </div>
      <div class="col-4 text-center">
        <toggle-button
          icon="fas fa-train"
          name="trein"
          :is-toggled-default-state="conveyancePreferences.train"
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
  name: 'TravelPreferences',
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
  computed: {
    getUserName() {
      return this.$store.getters.getUser.name
    },
  },
  methods: {
    submitForm: function(event) {
      event.preventDefault()
      this.$store.commit('saveUser', this.$data)
      this.$router.push('/home')
      //ugly
      this.$store.commit('incrementRegistrationStep', -3)
    },
    setRideAlong() {
      this.conveyancePreferences.rideAlong = !this.conveyancePreferences
        .rideAlong
    },
    setRegionTaxi() {
      this.conveyancePreferences.regionTaxi = !this.conveyancePreferences
        .regionTaxi
    },
    setBus() {
      this.conveyancePreferences.bus = !this.conveyancePreferences.bus
    },
    setShareCar() {
      this.conveyancePreferences.shareCar = !this.conveyancePreferences.shareCar
    },
    setShareBike() {
      this.conveyancePreferences.shareBike = !this.conveyancePreferences
        .shareBike
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
