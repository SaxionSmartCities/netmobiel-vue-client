<template>
  <v-container>
    <v-layout pt-3>
      <v-flex>
        <p class="text-primary-uppercase">Mijn auto</p>
      </v-flex>
    </v-layout>
    <v-layout column>
      <v-flex v-for="option in Object.keys(carOptions)" :key="option">
        <v-divider></v-divider>
        <v-layout align-center mr-3>
          <v-flex>
            <p class="body-1 mb-0 font-weight-bold">{{ option }}</p>
          </v-flex>
          <v-flex xs8>
            <v-text-field
              class="pb-0 pt-1 body-2"
              :id="option"
              :readonly="setReadOnly(option)"
              :value="carOptions[option]"
              @change="setDataCar(option, $event)"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'CarSettings',
  computed: {
    carOptions() {
      return this.$store.getters.getCarInfo
    },
  },
  methods: {
    setDataCar(key, value) {
      let object = {}
      object[key] = value
      this.$store.commit('setCarInfo', object)
    },
    setReadOnly(option) {
      if (option === 'color' || option === 'license') {
        return false
      }
      return true
    },
  },
  mounted: function() {
    this.$store.commit('showBackButton')
  },
}
</script>

<style scoped></style>
