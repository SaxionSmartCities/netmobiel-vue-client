<template>
  <v-container>
    <v-layout column justify-center fill-height pb-8 pt-8>
      <v-flex shrink mb-4>
        <h1>Reis beoordeeld! 🎉</h1>
      </v-flex>
      <v-flex shrink>
        Bedankt voor jouw beoordeling!
      </v-flex>
      <v-flex shrink>
        <v-btn block rounded outlined color="primary" to="/plan">
          Plan een nieuwe rit</v-btn
        >
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'TripReviewedPage',
  data: function() {
    return {}
  },
}
</script>

<style lang="scss"></style>
