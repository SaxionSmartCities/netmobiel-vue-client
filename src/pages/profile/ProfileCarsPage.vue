<template>
  <content-pane>
    <v-row>
      <v-col>
        <h3>Mijn auto's</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-row v-for="car in availableCars" :key="car.id" class="car">
          <v-col>
            <v-row dense>
              <v-col xs4>
                Kenteken:
              </v-col>
              <v-col>
                {{ car.licensePlate }}
              </v-col>
            </v-row>
            <v-row dense>
              <v-col xs4>
                Model:
              </v-col>
              <v-col font-italic>
                {{ car.brand }}&nbsp;{{ car.model }},&nbsp;{{ car.color }}
              </v-col>
            </v-row>
            <v-row dense>
              <v-col xs5>
                <v-btn
                  small
                  rounded
                  outlined
                  color="#2E8997"
                  @click="removeCar(car)"
                >
                  Verwijder
                </v-btn>
              </v-col>
              <v-col>
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
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="add-new-car">
        <v-btn
          large
          rounded
          outlined
          color="#2E8997"
          @click="$router.push('/profileAddCar')"
        >
          Auto toevoegen
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import luggageTypes from '@/constants/luggage-types.js'
import ContentPane from '@/components/common/ContentPane.vue'

function luggageLabel(option) {
  return luggageTypes[option].label
}
export default {
  name: 'ProfileCarsPage',
  components: {
    ContentPane,
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
        ridePlanOptions: { ...profile.ridePlanOptions, selectedCarId: car.id },
      })
    },
    removeCar(car) {
      // Remove car in the backend.
      this.$store.dispatch('cs/removeCar', car)
      // Update profile if the car that has been removed the default car is.
      if (this.selectedCarId === car.id) {
        this.selectAlternativeCar(this.availableCars[0])
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
  padding-left: 4px;
  padding-right: 4px;
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
