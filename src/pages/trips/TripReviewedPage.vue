<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Rit beoordeeld!</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        Bedankt voor jouw beoordeling! De
        {{ otherRoleName }} is automatisch op de hoogte gebracht.
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
  props: {
    otherRole: {
      type: String,
      required: true,
    },
  },
  computed: {
    otherRoleName() {
      return this.otherRole === 'driver' ? 'chauffeur' : 'passagier'
    },
  },
  created() {
    // Do not go back, the back end might have changed the trip state to COMPLETED.
    // uiStore.mutations.showBackButton()
  },
}
</script>

<style lang="scss"></style>
