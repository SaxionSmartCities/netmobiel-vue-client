<template>
  <v-layout pa-2 column>
    <v-flex>
      <v-layout column>
        <v-flex @click="editRoute">
          <v-divider></v-divider>
          <v-layout align-center ma-3>
            <v-flex xs2>
              <v-icon>fa-pencil-alt</v-icon>
            </v-flex>
            <v-flex>Wijzig deze rit</v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex>
      <v-layout column>
        <v-flex @click="replanSameRoute">
          <v-divider></v-divider>
          <v-layout align-center ma-3>
            <v-flex xs2>
              <v-icon>fa-redo</v-icon>
            </v-flex>
            <v-flex>Plan deze reis opnieuw</v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex>
      <v-layout column>
        <v-flex @click="removeRoute">
          <v-divider></v-divider>
          <v-layout align-center ma-3>
            <v-flex xs2>
              <v-icon>fa-times-circle</v-icon>
            </v-flex>
            <v-flex>Annuleer deze reis</v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'ItineraryOptions',
  components: {},
  props: {},
  data: function() {
    return {}
  },
  methods: {
    editRoute() {},
    replanSameRoute() {},
    removeRoute() {},
  },
}
</script>

<style lang="scss"></style>
