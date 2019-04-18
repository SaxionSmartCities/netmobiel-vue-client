<template>
  <v-container fill-height class="background-primary">
    <div class="align-center full-width box-widget background-white">
      <v-form wrap>
        <v-layout justify-center>
          <v-subheader class="headline">Waar wil je heen?</v-subheader>
        </v-layout>
        <v-layout row>
          <v-flex xs4 align-right>
            <v-subheader class="font-weight-bold">Van</v-subheader>
          </v-flex>
          <v-flex xs8>
            <v-text-field value="Enschede"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs4>
            <v-subheader class="font-weight-bold">Naar</v-subheader>
          </v-flex>
          <v-flex xs8 class="pa-0">
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
        <v-layout ma-2 align-center justify-center>
          <v-btn round>Plan je reis!</v-btn>
        </v-layout>
        <v-layout justify-center>
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

</style>
