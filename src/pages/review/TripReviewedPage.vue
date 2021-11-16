<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Rit beoordeeld! 🎉</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        Bedankt voor jouw beoordeling! Je rit is bevestigd en de chauffeur is
        automatisch op de hoogte gebracht.
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn block rounded outlined color="primary" to="/tripsOverviewPage">
          Terug naar ritten
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '../../components/common/ContentPane'

export default {
  name: 'TripReviewedPage',
  components: { ContentPane },
  data() {
    return {}
  },
}
</script>

<style lang="scss"></style>
