<template>
  <content-pane id="scroll">
    <v-row my-4 mr-4 ml-6>
      <v-col>
        <h1>Reis gepland! 🎉</h1>
      </v-col>
    </v-row>
    <v-row my-4 mr-4 ml-6>
      <v-col>
        <span>
          Jouw reis is bevestigd. We sturen je een herrinnering voor jouw
          vertrek.
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn block rounded depressed class="my-3 button" to="/home">
          Plan direct je terugreis</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn block rounded depressed outlined color="primary" to="/plan">
          Plan een nieuwe rit</v-btn
        >
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '../../components/common/ContentPane'
export default {
  name: 'TripPlanSubmitted',
  components: { ContentPane },
  data: function() {
    return {}
  },
}
</script>

<style lang="scss"></style>
