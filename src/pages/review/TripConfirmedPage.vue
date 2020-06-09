<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Reis bevestigd! 🎉</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        Bedankt voor jouw bevestiging!
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn block rounded outlined color="primary" to="/tripsOverviewPage">
          Terug naar reizen
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '../../components/common/ContentPane'

export default {
  name: 'TripConfirmedPage',
  components: { ContentPane },
  data() {
    return {}
  },
}
</script>

<style lang="scss"></style>
