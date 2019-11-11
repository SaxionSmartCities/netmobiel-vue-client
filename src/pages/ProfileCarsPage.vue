<template>
  <v-container>
    <v-layout column>
      <v-flex mb-3>
        <h3>Mijn auto's</h3>
      </v-flex>
      <v-flex>
        <div v-for="car in availableCars" :key="car.id" class="car">
          <div class="license">
            {{ car.licensePlate }}
          </div>
          <div class="brand">
            {{ car.brand }}&nbsp;{{ car.model }},&nbsp;{{ car.color }}
          </div>
          <v-layout row>
            <v-flex xs3>
              <span class="form-label font-weight-bold">
                Bagage
              </span>
            </v-flex>
            <v-flex xs9>
              {{ luggageOptions }}
            </v-flex>
          </v-layout>
          <v-layout row class="passengers">
            <v-flex xs3>
              <span class="form-label font-weight-bold">
                Personen
              </span>
            </v-flex>
            <v-flex xs9>
              {{ passengerCount }}
            </v-flex>
          </v-layout>
          <v-layout row class="actions">
            <v-flex xs4>
              <v-btn small round outline color="#2E8997" @click="editCar(car)">
                Wijzigen
              </v-btn>
            </v-flex>
            <v-flex xs8>
              <v-btn small round block @click="selectAlternativeCar(car)">
                Met deze auto rijden
              </v-btn>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
      <v-flex class="add-new-car">
        <v-btn
          large
          round
          outline
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
      return this.$store.getters['ps/getUser'].profile.ridePlanOptions.cars
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
  },
  methods: {
    selectAlternativeCar(car) {
      const profile = this.$store.getters['ps/getUser'].profile,
        cars = profile.ridePlanOptions.cars.slice(),
        index = cars.indexOf(car)
      // if the alternative is already the first car (or a nonexistent car), don't bother swapping
      if (index > 0) {
        const formerFirstCar = cars[0]
        cars[0] = car
        cars[index] = formerFirstCar
        this.$store.dispatch('ps/updateProfile', {
          ...profile,
          ridePlanOptions: { ...profile.ridePlanOptions, cars },
        })
      }
      this.$router.push('/plan')
    },
    editCar(car) {
      console.log(car)
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
.license {
  font-weight: bold;
  margin: 0.5em 0 0.25em 0;
}
.brand {
  color: #9d9d9d;
  font-size: 80%;
  margin: 0.25em 0 0.5em 0;
  font-variant: super;
}
.passengers {
  margin: 0.5em 0;
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
