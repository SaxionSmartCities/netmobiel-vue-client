<template>
  <div class="container">
    <div class="box-widget background-primary mt-3">
      <h3 class="text-center">Locatiegegevens</h3>
      <div class="mt-3">
        <div class="form-group row">
          <label for="location-name" class="col-1 col-form-label">
            <i class="fas fa-pen"></i>
          </label>
          <div class="col-10">
            <input
              id="location-name"
              v-model="currentLocation.name"
              type="text"
              placeholder="Voer hier een naam in voor deze locatie"
              class="form-control"
              required
            />
          </div>
        </div>

        <div class="form-group row">
          <label for="address" class="col-1 col-form-label">
            <i class="fas fa-home"></i>
          </label>
          <div class="col-10">
            <input
              id="address"
              v-model="currentLocation.address"
              placeholder="Voer hier het adres in"
              type="text"
              class="form-control"
              required
            />
          </div>
        </div>

        <button
          class="btn btn-secondary col-4 offset-1"
          @click="submitLocation()"
        >
          OK
        </button>
        <button
          class="btn btn-danger col-4 offset-2"
          @click="returnToPrevious()"
        >
          Cancel
        </button>
      </div>
    </div>
    <div class="box-widget background-primary mt-3 mb-3">
      <h5>Map goes here</h5>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      createNewLocation: false,
      currentLocation: null,
    }
  },
  beforeMount: function() {
    console.log('loaded screen')
    console.log(this.$store.getters.getCurrentSelectedLocationId)

    var selectedLocationId = this.$store.getters.getCurrentSelectedLocationId
    if (selectedLocationId === -1) {
      console.log('Creating a new location')
      this.$data.createNewLocation = true
      this.$data.currentLocation = {
        name: '',
        address: '',
        lat: 0.0,
        long: 0.0,
      }
    } else {
      var selectedLocation = this.$store.getters.getLocationById(
        selectedLocationId
      )

      this.$data.currentLocation = {
        name: selectedLocation.name,
        address: selectedLocation.address,
        lat: selectedLocation.lat,
        long: selectedLocation.long,
      }
    }
  },
  methods: {
    submitLocation: function() {
      console.log('submitting data')
      this.$store.commit('updateLocation', this.$data.currentLocation)
      this.$router.push('/locations')
    },
    returnToPrevious: function() {
      this.$router.push('/locations')
    },
  },
}
</script>

<style lang="scss"></style>
