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
              v-if="option === 'license'"
              :id="option"
              class="pb-0 pt-1 body-2"
              :rules="licenseRules"
              :value="carOptions[option]"
              placeholder="Geef uw kenteken op"
              @change="getNewCarData($event)"
            >
            </v-text-field>
            <v-text-field
              v-else-if="option === 'color'"
              :id="option"
              class="pb-0 pt-1 body-2"
              :value="carOptions[option]"
              @change="setDataCar(option, $event)"
            ></v-text-field>
            <v-text-field
              v-else
              :id="option"
              class="pb-0 pt-1 body-2"
              readonly
              :value="carOptions[option]"
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
  data() {
    return {
      licenseRules: [
        v => !!v || 'Kenteken moet worden ingevuld!',
        v => /^[A-Z 0-9]*$/.test(v) || 'Kenteken moet geldig zijn!',
        v => (v && v.length === 6) || 'Een kenteken bevat 6 tekens',
      ],
    }
  },
  computed: {
    carOptions() {
      return this.$store.getters.getCarInfo
    },
  },
  mounted: function() {
    this.$store.commit('showBackButton')
  },
  methods: {
    setDataCar(key, value) {
      let object = {}
      object[key] = value
      this.$store.commit('setCarInfo', object)
    },
    getNewCarData(license) {
      this.$store.dispatch('getLicenseInfo', license)
    },
  },
}
</script>

<style scoped></style>
