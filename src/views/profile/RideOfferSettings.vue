<template>
  <v-container>
    <v-layout pt-3>
      <v-flex>
        <p class="text-primary-uppercase">Aangeboden rit instellingen</p>
      </v-flex>
    </v-layout>
    <v-layout column>
      <v-flex v-for="option in Object.keys(ride)" :key="option">
        <v-divider></v-divider>
        <v-layout align-center mr-3>
          <v-flex>
            <p class="body-1 mb-0 font-weight-bold">{{ option }}</p>
          </v-flex>
          <v-flex xs8>
            <v-text-field
              v-if="option === 'repeat'"
              :id="option"
              class="pb-0 pt-1 body-2"
              :value="ride[option]"
              @click="$router.push('repeatSelection')"
            ></v-text-field>
            <v-text-field
              v-else-if="option === 'car'"
              :id="option"
              class="pb-0 pt-1 body-2"
              :value="carOptions(ride.car)"
            ></v-text-field>
            <v-text-field
              v-else
              :id="option"
              class="pb-0 pt-1 body-2"
              :value="ride[option]"
              @change="setDataExtraOptions(option, $event)"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'RideOfferSettings',
  data() {
    return {
      ride: this.$route.params.ride,
    }
  },
  mounted: function() {
    this.$store.commit('showBackButton')
  },
  methods: {
    setDataExtraOptions(key, value) {
      let object = {}
      object[key] = value
      this.$store.commit('setRideOfferPreferencesRepeat', object)
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
  },
}
</script>

<style scoped></style>