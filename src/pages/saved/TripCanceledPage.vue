<template>
  <content-pane id="scroll">
    <template v-slot:header>
      <v-tabs id="tabs" grow centered slider-color="#bddade">
        <v-tab class="white--text no-caps saved">
          <v-icon color="white">commute</v-icon>
          <span>
            Reizen
          </span>
        </v-tab>
        <v-tab class="white--text no-caps saved">
          <v-icon color="white">directions_car</v-icon>
          <span>
            Ritten
          </span>
        </v-tab>
      </v-tabs>
    </template>
    <v-row my-4 mr-4 ml-6>
      <v-col>
        <h1>Rit geanuleerd</h1>
      </v-col>
    </v-row>
    <v-row my-4 mr-4 ml-6>
      <v-col>
        <span>
          Je hebt jouw rit geannuleerd, jammer dat het niet doorgaat Henk is
          automatisch op de hoogte gebracht</span
        >
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
          color="primairy"
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
  name: 'TripCanceledPage',
  components: { ContentPane },
}
</script>
