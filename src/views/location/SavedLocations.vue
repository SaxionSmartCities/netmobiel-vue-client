<template>
  <div class="container">
    <div class="box-widget background-primary mt-3">
      <h1 class="text-center">Mijn Locaties</h1>

      <ul class="list-group">
        <li
          v-for="location in locations"
          :key="location.id"
          class="list-group-item"
          @click="openDetails(location.id)"
        >
          <span class="text-secondary">
            <i class="fas fa-map-marker-alt mr-2"></i>
            {{ location.name }}
          </span>
        </li>
      </ul>
    </div>
    <div class="bottom-button mt-5" @click="createLocation()">
      <i class="fas fa-plus-circle mr-2"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SavedLocations',
  computed: {
    locations: function() {
      return this.$store.getters.getLocations
    },
  },
  methods: {
    openDetails: function(id) {
      var currentLocationId = id

      this.$store.commit('setCurrentLocation', currentLocationId)

      this.$router.push('/editLocation')
    },
    createLocation: function() {
      this.$store.commit('setCurrentLocation', -1)

      this.$router.push('/editLocation')
    },
  },
}
</script>

<style lang="scss">
.bottom-button {
  display: flex;
  justify-content: flex-end;
  font-size: 4em;
}
</style>
