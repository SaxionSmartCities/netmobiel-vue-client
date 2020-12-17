<template>
  <content-pane>
    <v-row>
      <v-col>
        <h1>Rit bevestigd! 🎉</h1>
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
          Terug naar ritten
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'

export default {
  name: 'TripConfirmedPage',
  components: { ContentPane },
}
</script>

<style lang="scss"></style>
