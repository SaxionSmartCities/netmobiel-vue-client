<template>
  <v-container>
    <v-layout column>
      <v-flex mb-3>
        <h3>Mijn auto's</h3>
      </v-flex>
      <v-flex>
        <div v-for="car in availableCars" :key="car.id" class="car">
          <v-layout columns>
            <v-flex mt-4 xs4>
              Kenteken:
            </v-flex>
            <v-flex mt-4 font-weight-medium>
              {{ car.licensePlate }}
            </v-flex>
          </v-layout>
          <v-layout columns>
            <v-flex mt-1 xs4>
              Model:
            </v-flex>
            <v-flex mt-1 font-italic>
              {{ car.brand }}&nbsp;{{ car.model }},&nbsp;{{ car.color }}
            </v-flex>
          </v-layout>
          <v-layout row class="actions">
            <v-flex xs5>
              <v-btn
                small
                rounded
                outlined
                color="#2E8997"
                @click="removeCar(car)"
              >
                Verwijder
              </v-btn>
            </v-flex>
            <v-flex xs7>
              <v-btn v-if="car.id === selectedCarId" small rounded>
                Geselecteerd
              </v-btn>
              <v-btn
                v-else
                small
                rounded
                block
                depressed
                color="button"
                @click="selectAlternativeCar(car)"
              >
                Met deze auto rijden
              </v-btn>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
      <v-flex class="add-new-car">
        <v-btn
          large
          rounded
          outlined
          color="#2E8997"
          @click="$router.push('/profileAddCar')"
        >
          Auto toevoegen
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import luggageTypes from '@/constants/luggage-types.js'

function luggageLabel(option) {
  return luggageTypes[option].label
}
export default {
  computed: {
    availableCars() {
      return this.$store.getters['cs/getAvailableCars']
    },
    luggageOptions() {
      return this.$store.getters[
        'ps/getUser'
      ].profile.ridePlanOptions.luggageOptions
        .map(luggageLabel)
        .join(', ')
    },
    passengerCount() {
      return this.$store.getters['ps/getUser'].profile.ridePlanOptions
        .numPassengers
    },
    selectedCarId() {
      return this.$store.getters['ps/getUser'].profile.ridePlanOptions
        .selectedCarId
    },
  },
  created() {
    this.$store.commit('ui/showBackButton')
  },
  methods: {
    selectAlternativeCar(car) {
      const profile = this.$store.getters['ps/getUser'].profile
      this.$store.dispatch('ps/updateProfile', {
        ...profile,
        ridePlanOptions: { ...profile.ridePlanOptions, selectedCarId: car.id },
      })
      // navigate back in history and restore models from history state
      this.$router.go(-1)
    },
    removeCar(car) {
      // Remove car in the backend.
      this.$store.dispatch('cs/removeCar', car).then(() => {
        this.$store.dispatch('cs/fetchCars')
      })
      // Update profile if the car that has been removed the default car is.
      const profile = this.$store.getters['ps/getUser'].profile
      if (profile.ridePlanOptions.selectedCarId === car.id) {
        profile.ridePlanOptions.selectedCarId = -1
        this.$store.dispatch('updateProfile', profile)
      }
    },
  },
}
</script>

<style scoped>
.car {
  border: 1px solid #9d9d9d;
  border-radius: 7px;
  padding: 0 1em;
  margin-top: 1em;
}
.car:first-child {
  margin-top: 0;
}
.actions {
  margin: 1em 0;
}
.add-new-car {
  margin-top: 1em;
  padding-bottom: calc(56px + 1em);
  text-align: right;
}
</style>
