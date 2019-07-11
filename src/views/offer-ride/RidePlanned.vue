<template>
  <v-container pt-4>
    <v-layout column>
      <v-flex>
        <v-layout column ma-1>
          <v-flex
            ><h2>
              Rit gepland! 🎉
            </h2>
            <v-icon></v-icon>
          </v-flex>
          <v-flex
            ><p>
              Goed bezig, jouw rit wordt meegenomen in de zoekresultaten! Je
              krijgt automatisch een bericht als er iemand mee wil.
            </p></v-flex
          >
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout row wrap align-center>
          <v-flex my-2 ma-1>
            <v-btn
              round
              block
              large
              class="orange-white-button"
              @click="$router.push('savedRidesDriver')"
              >Bekijk geplande ritten
            </v-btn>
          </v-flex>
          <v-flex my-2 ma-1>
            <v-btn
              large
              round
              block
              class="blue-outlined-button"
              @click="$router.push('offerPage')"
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
