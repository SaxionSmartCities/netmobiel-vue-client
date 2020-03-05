<template>
  <content-pane>
    <v-row>
      <v-col>
        <h3>Mijn auto's</h3>
      </v-col>
    </v-row>
    <v-row v-for="car in availableCars" :key="car.id">
      <v-col>
        <car-card
          :car="car"
          :selected-car="selectedCarId"
          @set-car="selectAlternativeCar"
          @check-delete-car="checkDeleteCar"
        ></car-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="add-new-car">
        <v-btn
          large
          rounded
          outlined
          color="#2E8997"
          @click="$router.push('/AddCar')"
        >
          Auto toevoegen
        </v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Weet u dit zeker?</v-card-title>
        <v-card-text>
          Weet u zeker dat u de {{ carToDelete.brand }}
          {{ carToDelete.model }} met nummerplaats
          {{ carToDelete.licensePlate }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="dialog = false">
            Annuleren
          </v-btn>

          <v-btn text @click="removeCar(carToDelete)">
            Ja
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </content-pane>
</template>

<script>
import luggageTypes from '@/constants/luggage-types.js'
import ContentPane from '@/components/common/ContentPane.vue'
import CarCard from '@/components/cars/CarCard.vue'

function luggageLabel(option) {
  return luggageTypes[option].label
}
export default {
  name: 'ProfileCarsPage',
  components: {
    ContentPane,
    CarCard,
  },
  data: function() {
    return {
      dialog: false,
      carToDelete: { brand: '', model: '', licensePlate: '' },
    }
  },
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
        ridePlanOptions: {
          ...profile.ridePlanOptions,
          selectedCarId: car.car.id,
        },
      })
    },
    checkDeleteCar(car) {
      this.dialog = true
      this.carToDelete = car.car
    },
    removeCar(car) {
      this.dialog = false
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
