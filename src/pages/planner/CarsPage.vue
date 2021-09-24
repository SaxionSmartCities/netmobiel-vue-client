<template>
  <content-pane>
    <v-row>
      <v-col>
        <h3>Mijn auto's</h3>
      </v-col>
    </v-row>
    <v-row v-for="car in availableCars" :key="car.carRef" dense>
      <v-col>
        <car-card
          :car="car"
          :selected-car="selectedCarRef"
          @set-car="selectAlternativeCar"
          @check-delete-car="checkDeleteCar"
        ></car-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="right" mt-1>
        <v-btn
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
      <v-card class="py-1 px-3">
        <v-card-title class="headline">Auto Verwijderen</v-card-title>
        <v-card-text>
          <v-row class="d-flex flex-column">
            <v-col class="py-1">
              Weet u zeker dat u de {{ carToDelete.brand }}
              {{ carToDelete.model }} met nummerplaat
              {{ carToDelete.licensePlate }} wilt verwijderen?
            </v-col>
          </v-row>
          <v-row class="d-flex flex-column py-2">
            <v-col class="py-1">
              <v-btn
                large
                rounded
                block
                mb-4
                depressed
                color="button"
                @click="removeCar(carToDelete)"
              >
                Verwijderen
              </v-btn>
            </v-col>
            <v-col class="py-1">
              <v-btn
                large
                rounded
                outlined
                block
                mb-4
                depressed
                color="primary"
                @click="onCancel"
              >
                Behouden
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </content-pane>
</template>

<script>
import luggageTypes from '@/constants/luggage-types.js'
import ContentPane from '@/components/common/ContentPane.vue'
import CarCard from '@/components/cars/CarCard.vue'
import * as uiStore from '@/store/ui'
import * as csStore from '@/store/carpool-service'
import * as psStore from '@/store/profile-service'

function luggageLabel(option) {
  return luggageTypes[option].label
}
export default {
  name: 'ProfileCarsPage',
  components: {
    ContentPane,
    CarCard,
  },
  data() {
    return {
      dialog: false,
      carToDelete: { brand: '', model: '', licensePlate: '' },
    }
  },
  computed: {
    availableCars() {
      return csStore.getters.getAvailableCars
    },
    luggageOptions() {
      return psStore.getters.getProfile.ridePlanOptions.luggageOptions
        .map(luggageLabel)
        .join(', ')
    },
    passengerCount() {
      return psStore.getters.getProfile.ridePlanOptions.maxPassengers
    },
    selectedCarRef() {
      return psStore.getters.getProfile.ridePlanOptions.selectedCarRef
    },
  },
  created() {
    uiStore.mutations.showBackButton()
    csStore.actions.fetchCars()
  },
  methods: {
    selectAlternativeCar(car) {
      const profile = psStore.getters.getProfile
      psStore.actions.updateProfile({
        ...profile,
        ridePlanOptions: {
          ...profile.ridePlanOptions,
          selectedCarRef: car.carRef,
        },
      })
    },
    checkDeleteCar(car) {
      this.dialog = true
      this.carToDelete = car
    },
    onDelete() {
      this.$emit('delete', {
        scope: this.rideScopeRadio,
        cancelReason: this.cancelReason,
      })
    },
    onCancel() {
      this.dialog = false
    },
    removeCar(car) {
      this.dialog = false
      if (this.selectedCarRef === car.carRef) {
        const alternative =
          this.availableCars.length > 1
            ? this.availableCars[0]
            : { carRef: undefined }
        this.selectAlternativeCar(alternative)
      }
      // Remove car in the backend.
      csStore.actions.removeCar(car)
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
</style>
