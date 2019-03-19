<template>
  <div class="container">
    <div class="box-widget background-primary mt-3">
      <h1 class="text-center">Mijn Locaties</h1>

      <ul class="list-group">
        <li
          v-for="location in locations"
          :key="location.name"
          class="list-group-item"
        >
          <router-link
            class="text-secondary"
            :to="'/editLocation/' + location.name"
          >
            <i class="fas fa-map-marker-alt mr-2"></i> {{ location.name }}
          </router-link>
        </li>
        <li class="list-group-item">
          <i class="fas fa-plus-circle mr-2"></i>
          Nieuwe locatie toevoegen
        </li>
      </ul>
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
}
</script>

<style lang="scss"></style>
