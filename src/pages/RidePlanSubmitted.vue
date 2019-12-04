<template>
  <v-container>
    <v-layout column justify-center fill-height>
      <v-flex shrink mb-4>
        <h1>Rit gepland! 🎉</h1>
      </v-flex>
      <v-flex shrink>
        Goed bezig, jouw rit wordt meegenomen in de zoekresultaten! Je krijgt
        automatisch bericht als er iemand met je mee wil.
      </v-flex>
      <v-flex shrink>
        <v-btn block rounded depressed class="my-3 button" to="/home">
          Bekijk geplande ritten</v-btn
        >
        <v-btn block rounded depressed outlined color="green" to="/plan">
          Plan een nieuwe rit</v-btn
        >
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'RidePlanSubmitted',
  data: function() {
    return {}
  },
}
</script>

<style lang="scss"></style>
