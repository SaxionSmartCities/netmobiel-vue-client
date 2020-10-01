<template>
  <v-container
    align-center
    justify-center
    fill-height
    fluid
    grid-list-lg
    class="background-primary"
  >
    <v-row class="justify-center">
      <v-col class="box-widget background-white shrink flex sm9 xs11 px-4">
        <v-row>
          <v-col align="center"><h1>Wat wil je doen?</h1></v-col>
        </v-row>
        <v-row class="mt-2 px-2">
          <v-btn large rounded depressed color="button" block to="/search">
            Een reis plannen
          </v-btn>
        </v-row>
        <v-row class="pa-2">
          <v-col class="mid-grey pa-0" align="center">
            Met iemand meerijden of via het OV.
          </v-col>
        </v-row>
        <v-row class="mt-5 px-2">
          <v-btn large rounded depressed color="button" block to="/plan">
            Een rit aanbieden
          </v-btn>
        </v-row>
        <v-row class="pa-2">
          <v-col class="mid-grey pa-0" align="center">
            Zelf rijden en iemand meenemen.
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as uiStore from '@/store/ui'

export default {
  name: 'ModeSelectionPage',
  mounted() {
    uiStore.mutations.setSelectedNav('planner')
  },
}
</script>

<style lang="scss"></style>
