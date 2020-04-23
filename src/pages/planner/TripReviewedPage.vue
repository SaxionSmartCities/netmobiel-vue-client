<template>
  <content-pane>
    <v-row class="ma-auto mt-2">
      <v-col>
        <h1>Reis beoordeeld! 🎉</h1>
      </v-col>
    </v-row>
    <v-row class="ma-auto mt-2">
      <v-col>
        Bedankt voor jouw beoordeling!
      </v-col>
    </v-row>
    <v-row class="ma-auto mt-2">
      <v-col>
        <v-btn block rounded outlined color="primary" to="/plan">
          Plan een nieuwe rit</v-btn
        >
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
export default {
  name: 'TripReviewedPage',
  data() {
    return {}
  },
}
</script>

<style lang="scss"></style>
