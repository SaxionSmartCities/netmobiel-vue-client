<template>
  <v-container
    align-center
    justify-center
    fill-height
    class="background-primary"
  >
    <div class="align-center full-width box-widget background-white">
      <v-form wrap>
        <v-layout justify-center>
          <v-subheader class="headline">Waar wil je heen?</v-subheader>
        </v-layout>
        <v-layout>
          <v-flex xs4>
            <v-subheader class="font-weight-bold">Van</v-subheader>
          </v-flex>
          <v-flex xs7>
            <v-text-field value="Enschede"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout justify-end>
          <v-icon class="absolute-icon">import_export</v-icon>
        </v-layout>
        <v-layout>
          <v-flex xs4>
            <v-subheader class="font-weight-bold">Naar</v-subheader>
          </v-flex>
          <v-flex xs7 class="pa-0">
            <v-text-field value="Deventer"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs4>
            <v-subheader class="font-weight-bold">Aankomst</v-subheader>
          </v-flex>
          <v-flex xs8>
            <v-text-field value="Morgen, 10.00 uur"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout mt-2>
          <v-flex><v-btn class="full-width subheading" round>Plan je reis!</v-btn></v-flex>
        </v-layout>
        <v-layout mt-2 justify-center>
          <v-icon>settings</v-icon>
          <v-subheader>Reisvoorkeuren</v-subheader>
        </v-layout>
      </v-form>
    </div>
  </v-container>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.getUser
    },
  },
}
</script>

<style lang="scss">
.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat) {
  background-color: $color-orange;
  color: $color-white;
  text-transform: none;
}
</style>
