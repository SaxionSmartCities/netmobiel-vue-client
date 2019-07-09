<template>
  <v-container>
    <v-layout column>
      <v-flex>
        <v-layout>
          <v-flex
            ><h2>
              Rit gepland!
            </h2>
            <v-icon></v-icon>
          </v-flex>
          <v-flex
            ><p>
              Goed bezig, jouw rit wordt meegenomen in de zoekresultaten! Je
              krijgt automatich een bericht als er iemand mee wil.
            </p></v-flex
          >
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout wrap>
          <v-flex>
            <v-btn
              round
              block
              large
              class="orange-white-button"
              @click="$store.commit('setRideApprovalDialog', { show: false })"
              >Bekijk geplande ritten
            </v-btn>
          </v-flex>
          <v-flex>
            <v-btn
              large
              round
              block
              class="blue-white-button"
              @click="$store.commit('setRideApprovalDialog', { show: false })"
              >Plan een nieuwe rit
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container></template
>

<script>
export default {
  name: 'RidePlanned',
}
</script>

<style scoped></style>
