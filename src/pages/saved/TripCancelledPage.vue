<template>
  <content-pane id="scroll">
    <v-row my-4 mr-4 ml-6>
      <v-col>
        <h1>Rit geannuleerd</h1>
      </v-col>
    </v-row>
    <v-row my-4 mr-4 ml-6>
      <v-col>
        <span>
          Je hebt jouw rit geannuleerd, jammer dat het niet doorgaat.
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          to="/modeSelection"
          large
          rounded
          block
          mb-4
          depressed
          color="button"
        >
          Plan een nieuwe rit
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          to="TripsOverviewPage"
          large
          rounded
          outlined
          block
          mb-4
          depressed
          color="primary"
        >
          bekijk mijn ritten
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>
<script>
import ContentPane from '@/components/common/ContentPane.vue'
export default {
  name: 'TripCancelledPage',
  components: { ContentPane },
}
</script>
