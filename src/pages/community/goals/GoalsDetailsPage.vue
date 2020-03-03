<template>
  <content-pane>
    <v-row align="center" justify="center">
      <v-img
        src="../../../../src/assets/achterhoek_background.jpg"
        lazy-src="https://picsum.photos/id/11/100/60"
        aspect-ratio="1"
        class="grey lighten-2"
        max-width="500"
        max-height="300"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </v-row>
    <v-row>
      <span class="title pt-4">
        Renovatie St. Bonifatiuskerk
      </span>
    </v-row>
    <v-row class="mb-4">
      <span class="overline">Lichtenvoorde</span>
    </v-row>
    <v-row>
      <span>
        De Sint-Bonifatiuskerk is een rooms-katholieke kerk in Lichtenvoorde,
        gebouwd in de jaren 1912 en 1913. De architect was WOlter te Riele, die
        een negotisch
      </span>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-progress-circular
          :rotate="-90"
          :size="100"
          :width="10"
          :value="100"
          color="primary"
        >
          {{ value }}
        </v-progress-circular>
        <span>Donateurs</span>
      </v-col>
      <v-col cols="4">
        <v-progress-circular
          :rotate="-90"
          :size="100"
          :width="10"
          :value="77"
          color="primary"
        >
          {{ value }}
        </v-progress-circular>
        <span>Gedoneerd</span>
      </v-col>
      <v-col cols="4">
        <v-progress-circular
          :rotate="-90"
          :size="100"
          :width="10"
          :value="75"
          color="primary"
        >
          {{ value }}
        </v-progress-circular>
        <span>Behaald</span>
      </v-col>
    </v-row>
  </content-pane>
</template>

<script>
import ContentPane from '../../../components/common/ContentPane'
export default {
  name: 'GoalsDetailsPage',
  components: { ContentPane },
}
</script>

<style scoped></style>
