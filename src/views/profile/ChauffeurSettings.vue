<template>
  <v-container>
    <v-layout>
      <v-flex>
        <v-layout pt-3>
          <v-flex>
            <p class="text-primary-uppercase">Chauffeur</p>
          </v-flex>
        </v-layout>

        <v-layout column>
          <v-flex>
            <v-divider></v-divider>
            <v-layout align-center mr-3>
              <v-flex>
                <p class="body-1 mb-0">Ben ik een chauffeur</p>
              </v-flex>
              <v-flex xs1>
                <v-switch
                  :input-value="getChauffeur"
                  color="#2E8997"
                  @change="setChauffeur($event)"
                ></v-switch>
              </v-flex>
            </v-layout>

            <v-layout pt-3 justify-space-between>
              <v-flex shrink>
                <p class="text-primary-uppercase">Mijn auto's</p>
              </v-flex>
              <v-flex shrink>
                <v-btn class="size" fab :to="{ name: 'addCar' }">
                  <v-icon small>add</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-layout column>
              <v-flex v-for="car in getCars" :key="car.license">
                <v-divider></v-divider>
                <v-layout>
                  <v-flex @click="toCarSettings(car)">
                    <p>{{ carOptions(car) }}</p>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>

            <v-layout pt-3>
              <v-flex>
                <p class="text-primary-uppercase">Ritten</p>
              </v-flex>
              <v-flex shrink>
                <v-btn class="size" fab :to="{ name: 'offerPage' }">
                  <v-icon small>add</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-layout column>
              <v-flex v-for="ride in getRides" :key="ride.detour">
                <v-divider></v-divider>
                <v-layout align-center mr-3>
                  <v-flex @click="toRideOfferSettings(ride)">
                    <p>{{ rideOptions(ride) }}</p>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'ChauffeurSettings',
  data() {
    return {
      licensePlate: '',
      model: '',
      brand: '',
      color: '',
    }
  },
  computed: {
    getCars() {
      return this.$store.getters.getCars
    },
    getRides() {
      return this.$store.getters.getOfferedRides
    },
    getChauffeur() {
      return this.$store.getters.isChauffeur
    },
    extraOptions() {
      let list = this.$store.getters.getRideOfferPreferences
      return list['repeat']
    },
  },
  mounted: function() {
    this.$store.commit('showBackButton')
  },
  methods: {
    rideOptions(ride) {
      return ride['detour'] + ', ' + ride['persons']
    },
    carOptions(car) {
      return (
        car['license'] +
        ', ' +
        car['brand'] +
        ', ' +
        car['model'] +
        ', ' +
        car['color']
      )
    },
    setChauffeur(value) {
      this.$store.commit('setChauffeurValue', value)
    },
    toCarSettings(car) {
      this.$router.push({ name: 'carSettings', params: { car: car } })
    },
    toRideOfferSettings(ride) {
      this.$router.push({ name: 'rideOfferSettings', params: { ride: ride } })
    },
  },
}
</script>

<style lang="scss">
.size {
  max-height: 25px;
  max-width: 25px;
}
</style>
