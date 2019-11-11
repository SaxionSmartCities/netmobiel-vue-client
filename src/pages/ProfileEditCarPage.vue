<template>
  <v-container>
    <v-layout column>
      <v-flex mb-3>
        <h3>{{ isEditing ? 'Auto wijzigen' : 'Auto instellingen' }}</h3>
      </v-flex>
      <v-divider />
      <v-flex>
        <v-layout align-center my-2>
          <v-flex xs3>
            Kenteken
          </v-flex>
          <v-flex xs9>
            <span class="license-plate" v-text="car.licensePlate" />
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout align-center my-1>
          <v-flex xs3 />
          <v-flex xs9 text-truncate>
            <span class="car-make">
              {{ car.brand }}, {{ car.model }} ({{
                car.registrationYear
              }})
            </span>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout>
          {{ isEditing ? "Verwijderen en Opslaan" : "Annuleren en Opslaan" }}
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'ProfileEditCar',
  data: function() {
    return {
      car: {},
    }
  },
  computed: {
    availableCars() {
      return this.$store.getters['ps/getUser'].profile.ridePlanOptions.cars
    },
    isEditing() {
      return this.car.id
    }
  },
  mounted() {
    console.log(this.$store.getters['cs/getSearchLicensePlate'])
  },
}
</script>

<style lang="scss">
.license-plate {
  text-transform: uppercase;
}
.car-make {
  font-style: italic;
  font-size: 80%;
  color: $color-mid-grey;
}
</style>
