<template>
  <content-pane>
    <v-row class="ma-auto mt-2">
      <v-col>
        <h1>Rit gepland! 🎉</h1>
      </v-col>
    </v-row>
    <v-row class="ma-auto mt-2">
      <v-col>
        Dank je wel! Jouw rit wordt meegenomen in de zoekresultaten! Je krijgt
        automatisch bericht als er iemand met je mee wil.
      </v-col>
    </v-row>
    <v-row class="ma-auto mt-2">
      <v-col>
        <v-btn
          block
          rounded
          depressed
          class="my-3 button"
          to="/tripsOverviewPage"
        >
          Bekijk geplande ritten
        </v-btn>
        <v-btn block rounded depressed outlined color="primary" to="/plan">
          Plan een nieuwe rit
        </v-btn>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '@/components/common/ContentPane.vue'

export default {
  name: 'RidePlanSubmitted',
  components: { ContentPane },
  data() {
    return {}
  },
}
</script>

<style lang="scss"></style>
