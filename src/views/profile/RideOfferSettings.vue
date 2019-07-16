<template>
  <v-container>
    <v-layout pt-3>
      <v-flex>
        <p class="text-primary-uppercase">Aangeboden rit instellingen</p>
      </v-flex>
    </v-layout>
    <v-layout column>
      <v-flex v-for="option in Object.keys(extraOptions)" :key="option">
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
              :value="extraOptions[option]"
              @click="$router.push('repeatSelection')"
            ></v-text-field>
            <v-text-field
              v-else
              :id="option"
              class="pb-0 pt-1 body-2"
              :value="extraOptions[option]"
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
    return {}
  },
  computed: {
    extraOptions() {
      return this.$store.getters.getRideOfferPreferences
    },
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
  },
}
</script>

<style scoped></style>
