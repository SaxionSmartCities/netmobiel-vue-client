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

            <v-layout pt-3>
              <v-flex>
                <p class="text-primary-uppercase">Mijn auto's</p>
              </v-flex>
            </v-layout>
            <v-layout column>
              <v-flex>
                <v-divider></v-divider>
                <v-layout>
                  <v-flex @click="toCarSettings">
                    <p>{{ carOptions }}</p>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>

            <v-layout pt-3>
              <v-flex>
                <p class="text-primary-uppercase">Ritten</p>
              </v-flex>
            </v-layout>
            <v-layout column>
              <v-flex>
                <v-divider></v-divider>
                <v-layout align-center mr-3>
                  <v-flex @click="toRideOfferSettings">
                    <p>{{ extraOptions }}</p>
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
    getChauffeur() {
      return this.$store.getters.isChauffeur
    },
    carOptions() {
      let list = this.$store.getters.getCarInfo
      return (
        list['license'] +
        ', ' +
        list['brand'] +
        ', ' +
        list['model'] +
        ', ' +
        list['color']
      )
    },
    extraOptions() {
      let list = this.$store.getters.getRideOfferPreferences
      return list['repeat']
    },
  },
  methods: {
    setChauffeur(value) {
      this.$store.commit('setChauffeurValue', value)
    },
    toCarSettings() {
      this.$router.push({ name: 'carSettings' })
    },
    toRideOfferSettings() {
      this.$router.push({ name: 'rideOfferSettings' })
    },
  },
  mounted: function() {
    this.$store.commit('showBackButton')
  },
}
</script>

<style lang="scss"></style>
